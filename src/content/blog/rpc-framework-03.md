---
title: 从零开始写RPC框架-03
description: 完成 RPC 框架的客户端实现，通过动态代理实现本地调用远程方法并返回结果
pubDate: 2020-09-08T15:12:01.000Z
heroImage: https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/pexels-sam-kolder-2387873.jpg
category: ["技术实践"]
draft: false
tags:
  - Java
  - RPC
---

上篇讲到我们已经可以通过传名称去调用远程方法，那这次就把剩下的本地调用方法，然后远程执行并返回结果。

# 升级客户端为Web项目

这个也没什么可以说了可以参考上篇升级服务端。

## 创建测试用接口

就好像平常使用那样创建一个Controller引用`ICallService`就好了

```java
@RestController
public class TestController {
    private ICallService service;

    @GetMapping("/{msg}")
    public String testRpc(@PathVariable String msg){
        return service.callTest(msg);
    }
}
```

但是这里即使不运行也能猜到运行结果，就是空指针，这个service从来都没有被初始化。

那么问题来了，这个service的实现类并不在当前项目下面，new也new不出来，用`Spring`也没办法注入。让他空的话又会空指针。那应该咋搞。

思路大概是这样，我初始化的时候塞一个代理给它，然后在调用里面的方法的时候，用前面准备的去远程调用就好了。

还记得上期的`CglibProxyFactory`和`MethodInterceptorImpl`吗？在`MethodInterceptorImpl`里面`intercept`
不是有是一个拦截吗？用这个去实现就好了。

## 改造返回类（`RpcResponse`）

原来返回一个message肯定是不够的嘛，作为一个方法，肯定是各式各样的返回值，所以我们先把返回实体修改一下。

```java
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RpcResponse<T> {
    private String msg;
    private Integer code;
    private T data;
}
```

就跟普通的web返回体类似。原来用到的对应改就好了。

> 既然有code去判断状态，就不加success了，传输能少一点就是一点。

## 创建远程代理实现类

首先创建一个远程方法拦截器的实现类，为了跟原来本地的区分开来，这就就把原来的`MethodInterceptorImpl改成LocalMethodInterceptorImpl`
，然后创建`RemoteMethodInterceptorImpl`。

`RemoteMethodInterceptorImpl`具体要实现就是远程调用了，这里就直接把上期写的测试方法搬过来就好了。

```java
@Slf4j
public class RemoteMethodInterceptorImpl implements MethodInterceptor {
    @Override
    @SneakyThrows
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) {
        log.info("调用远程方法前-->{}",method.getName());
        RpcRequest build = RpcRequest.builder()
                .interfaceName(method.getDeclaringClass().getName())
                .methodName(method.getName())
                .args(args)
                .parameterTypes(method.getParameterTypes())
                .build();
        RpcResponse<Object> response = new NettyClient("localhost", 6666).send(build);
        if(response.getCode()== HttpStatus.HTTP_OK){
            return response.getData();
        }
        log.info("调用远程方法后-->{}",method.getName());
        return null;
    }
}
```

> `NettyClient`这个原本是在`adouge-rpc-client`里面，现在被我移动到了`adouge-rpc-tool`里面。

## 改造代理工厂

实现类有了，那下一步就是改造工厂（`CglibProxyFactory`）。

这个挺简单的，复制粘贴改下实现类就好了,我为了区分开来，把原来的改成`getLocalProxy`。

```java
public class CglibProxyFactory {

    public static Object getLocalProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置被代理类
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new LocalMethodInterceptorImpl());
        // 创建代理类
        return enhancer.create();
    }
    public static Object getRemoteProxy(Class<?> clazz) {
        Enhancer enhancer = new Enhancer();
        enhancer.setClassLoader(clazz.getClassLoader());
        enhancer.setSuperclass(clazz);
        enhancer.setCallback(new RemoteMethodInterceptorImpl());
        return enhancer.create();
    }
}
```

## 实现`postProcessAfterInitialization`

下一步就是在它初始化的时候随便晒点东西，告诉jvm不为空，你有个代理帮你执行方法。

既然集成了`Spring`那就直接用`BeanPostProcessor`的后置处理去处理就好了。

### 创建`RpcReference`

同样的我们需要跟普通Bean区分开来。同样的创建一个注解。

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
@Inherited
@Component
public @interface RpcReference {
}
```

> 记得在controller里面的service加上注解

我们继续实现后置处理的逻辑。

```java
public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        Class<?> cls = bean.getClass();
        Field[] declaredFields = cls.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            RpcReference rpcReference = declaredField.getAnnotation(RpcReference.class);
            if (rpcReference != null) {
                Object proxy = CglibProxyFactory.getRemoteProxy(declaredField.getType());
                declaredField.setAccessible(true);
                try {
                    declaredField.set(bean,proxy);
                } catch (IllegalAccessException e) {
                    log.error("设置代理异常->",e);
                }
            }
        }
        return bean;
    }
```

其实也没什么可以说，就是判断这个bean里面是否有这个注解，有就给他一个代理。

## 测试

把程序跑起来，访问http://localhost:8081/asdasdas 就会看到 `asdasdas`被显示出来

![IdNcmP](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/09/IdNcmP.png)

> 同时开两个web项目端口冲突的话就在`adouge-rpc-client`的resource里面添加application.yml，在里面改端口
>
> ```yaml
> server:
>   port: 8081
> ```

现在远程的地址（localhost）跟端口是写死的，下篇就改成动态的吧。
