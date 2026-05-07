---
title: 从零开始写RPC框架-02
description: 实现 RPC 框架的动态代理功能，使用 CGLIB 和 Spring 实现远程方法调用
pubDate: 2020-09-07T10:18:24.000Z
heroImage: https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/15/pexels-pratik-gupta-2748716.jpg
category: ["技术实践"]
draft: false
tags:
  - Java
  - RPC
  - CGLIB
  - Spring
---

上一篇讲到完`Netty`服务端和客户端之间的一个通讯，这次继续接住上篇写的代码继续拓展。本期主要是把Netty远程调用+动态代理给弄出来。

> 从零开始写RPC框架-01

我们的`RPC`说到底说到底就是远程调用方法，远程我们实现了，现在就是调用，调用的话我们用的是动态代理。

在上一期创建传输的报文中就已经定义好了需要调用的接口和方法名，这里就先把他们晾一边，先把动态代理基础弄好。

# 代理模式

代理模式主要就分开两个，一个`静态代理` 另一个`动态代proxy`。

静态的就先不讲了，比较固定，基本上是写死那种，没太大意义。

## 动态代理

`Java` 动态代理的话其中两种，一个是`JDKProxy`，另外一个是`CGLIB`。

> JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类。

### CGLIB

由于各种主客观因素，所以我们这里选择使用`CBLIB`。

首先我们加坐标。

```xml
<!-- cglib -->
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

然后创建一个自定义`MethodInterceptor`。

```java
public interface MethodInterceptor extends Callback {

    /**
     * 拦截被代理类中的方法
     * @param obj 用于调用原始方法
     * @param method 方法名
     * @param args 参数
     * @param proxy 用于调用原始方法
     * @return 调用返回
     * @throws Throwable e
     */
    Object intercept(Object obj, Method method, Object[] args,MethodProxy proxy) throws Throwable;

}
```

> `Method`是`java.lang.reflect.Method`的

然后我们写一个准备去被调用的类，这个比较简单，随意输出点东西就好了。

```java
public interface ICallService {
    /**
     * 测试代理
     * @param arg1 参数
     * @return 返回值
     */
    String callTest(String arg1);
}
----------------------------------------------
public class CallServiceImpl implements ICallService {
    @Override
		public String callTest(String arg1) {
        log.info("callTest->{}",arg1);
        return arg1;
    }
}
```

下一步，我们去自定义一个方法拦截器。

```java
@Slf4j
public class MethodInterceptorImpl implements MethodInterceptor {
    @Override
    @SneakyThrows
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) {
        log.info("执行方法前-->{}",method.getName());
        Object o = proxy.invokeSuper(obj, args);
        log.info("执行方法后-->{}",method.getName());
        return o;
    }
}
```

然后定义一个`CGLIB`工厂类，用于获取代理类。

```java
public class CglibProxyFactory {

   public static Object getProxy(Class<?> clazz) {
        // 创建动态代理增强类
        Enhancer enhancer = new Enhancer();
        // 设置类加载器
        enhancer.setClassLoader(clazz.getClassLoader());
        // 设置被代理类
        enhancer.setSuperclass(clazz);
        // 设置方法拦截器
        enhancer.setCallback(new MethodInterceptorImpl());
        // 创建代理类
        return enhancer.create();
    }
}
```

然后我们就可以简单测试一下代理效果。

```java
		@Test
    public void testCGLIB(){
        ICallService callService= (ICallService) CglibProxyFactory.getProxy(CallServiceImpl.class);
        System.out.println(callService.callTest("sb"));
    }
```

```java
执行方法前-->callTest
callTest->sb
执行方法后-->callTest
sb
```

然后我们的`CGLIB`简单实现就可以了。下一步我们把`Netty`联动起来。

# 联动`Netty`

这里的话我们就去实现一个小功能，客户端发送接口名和方法名，然后服务端返回执行的效果。

发送我们展示就不需要改造了，但是之前`NettyServerHandler`里面返回值是写死的，现在要改成动态的。

首先我们创建一个处理类。

## 创建处理类`RpcRequestHandler`

这个处理类主要就是用来代理，通过方法名、类名等信息获取对应的`Method`及`代理类`。

```java
public class RpcRequestHandler {

    /**
     * 用作处理
     */
    @SneakyThrows
    public Object handler(RpcRequest request) {
        return invokeTargetMethod(request,CglibProxyFactory.getProxy(Class.forName(request.getInterfaceName())));
    }

    /**
     * 用作方法调用
     */
    @SneakyThrows
    private  Object invokeTargetMethod(RpcRequest request, Object service) {
        Method method=service.getClass().getMethod(request.getMethodName(),request.getParameterTypes());
        return method.invoke(service,request.getArgs());
    }

}
```

## 修改`NettyServerHandler`返回值

这个比较简单，就是把之前写死的改成`RpcRequestHandler`调用就好了。

```java
@Slf4j
public class NettyServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        super.channelRead(ctx, msg);
        try {
            RpcRequest rpcRequest = (RpcRequest) msg;
            log.info("服务端返回信息: [{}] ", rpcRequest);
            RpcResponse messageFromServer = RpcResponse.builder().message(String.valueOf(new RpcRequestHandler().handler(rpcRequest))).build();
            ChannelFuture f = ctx.writeAndFlush(messageFromServer);
            f.addListener(ChannelFutureListener.CLOSE);
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }
```

## 测试

改造完我们就可以测试了。把上期写的测试类改一下。

```java
		@Test
    @SneakyThrows
    public void testSend(){
        String methodName="callTest";
        Method method = ICallService.class.getMethod(methodName, String.class);
        RpcRequest build = RpcRequest.builder()
                .interfaceName(ICallService.class.getName())
                .methodName(method.getName())
                .args(new String[]{"sb"})
                .parameterTypes(method.getParameterTypes())
                .build();
        System.out.println(new NettyClient("localhost", 6666).send(build));
    }
```

把服务端和客户端按顺序跑，就会看到一下结果。

客户端并没有任何东西返回，但是服务端缺报错了。

```java
java.lang.reflect.InvocationTargetException
Caused by: java.lang.NoSuchMethodError: java.lang.Object.callTest(Ljava/lang/String;)Ljava/lang/String;
```

简单来说就是找不到方法。

> Q:我都是从`class`里面拿类名，从`class`里面拿`Method`的名怎么还会报错呢？
>
> A:我一个接口类怎么知道怎么去运行这个方法？

好，我们第一次测试就这样炸了。接口类是不能直接反射调用方法的，只能去获取它的实现类。

方法的话我想到的有两种。

+ 是通过各种反射拿到它的实现类
+ 通过`Spring`拿到实现类

第一种的话我在下垃圾的技术暂时没找到很好的实现方法。所以我们只能借助`Spring`。

# 改造服务端

废话不多说，直接上坐标:

在最大的pom加上版本号及版本控制

```xml
		<properties>
        <spring.boot.version>2.3.3.RELEASE</spring.boot.version>
    </properties>
		<dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring.boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

然后在`adouge-rpc-server`加上web

```xml
		<dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
```

## 添加启动类

```java
@SpringBootApplication(scanBasePackages = {"com.adouge","cn.hutool.extra.spring"})
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
```

## 修改`RpcRequestHandler`

我们这里就简单的借助`Spring IOC`  通过`IOC`去获取它的实现类，在生成实现类的代理类

```java
 @SneakyThrows
    public Object handler(RpcRequest request) {
        Object bean = SpringUtil.getBean(Class.forName(request.getInterfaceName()));
        return invokeTargetMethod(request,bean);
    }
```

> 记得在实现类加上@Service

我们这里用到的`SpringUtil`是[hutool](https://hutool.cn/docs/#/)里面的,这里就不详细说明了。

## 测试

然后我们再去运行服务端和客户端。就可以看到:

```java
11:04:42.093 [nioEventLoopGroup-2-1] INFO com.adouge.rpc.core.tool.netty.NettyClientHandler - 服务端返回数据: [RpcResponse(message=sb)]
RpcResponse(message=sb)
```

其实到这块这部分就已经完全可以走通了，但是绕了一套圈弄出来的`CGLIB`就没用上。既然是一个学习性质的项目，肯定是不能直接调用已封装好的东西。~~hutool不算~~

# 结合`Spring`获取实现类

我们这里借助`BeanPostProcessor`去实现这个东西。先说下原理，就是在bean初始化的时候记录这个bean和他所实现的接口。

`Spring`在加载`bean`的时候肯定会加载各种各样的`bean`，但这些bean都不一定是我们`RPC`调用的时候所用到的，所以需要找个东西区分开来，我这里使用注解去区分开来。

## 创建RPC服务用的注解

在`adouge-rpc-tool`里面创建一个注解用来区分`RPC`服务和普通服务的。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Inherited
@Component
public @interface RpcService {
}
```

## 服务提供者

首先我们需要定义一个Map，里面用来存放接口以及他的实现类。所以我们创建一个`ServiceProvider`以及他的实现类。

```java
public interface ServiceProvider {
    /**
     * 添加服务类
     * @param bean bean
     * @param interfaceName 接口名
     */
    void addService(Object bean,String interfaceName);

    /**
     * 获取服务类
     * @param interfaceName 接口名
     * @return 服务嗲你勒
     */
    Object getService(String interfaceName);
}
```

```java
@Slf4j
@Component
public class ServiceProviderImpl implements ServiceProvider{
    private final Map<String, Object> serviceMap= new ConcurrentHashMap<>();

    @Override
    public void addService(Object bean,String interfaceName) {
        serviceMap.put(interfaceName,bean);
    }
    @Override
    @SneakyThrows
    public Object getService(String interfaceName) {
        Object service = serviceMap.get(interfaceName);
        if (null == service) {
            throw new Exception("找不到对应的Bean");
        }
        return service;
    }
}
```

## 在`BeanPostProcessor`里面区分

实现`BeanPostProcessor`里面的前置方法`postProcessBeforeInitialization`

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class RpcBeanPostProcessor implements BeanPostProcessor {
    private final ServiceProvider serviceProvider;

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        Class<?> cls = bean.getClass();
        if (cls.isAnnotationPresent(RpcService.class)) {
            Class<?>[] interfaces = cls.getInterfaces();
            for (Class<?> anInterface : interfaces) {
                log.info("【{}】添加到服务实现类---", anInterface.getName(), bean);
                serviceProvider.addService(bean, anInterface.getName());
            }
        }
        return bean;
    }
}
```

## 再次修改`RpcRequestHandler`

同样的单例获取`ServiceProvider`，然后调用`getService`获取实现类。

```java
@Component
@RequiredArgsConstructor
public class RpcRequestHandler {
    private final ServiceProvider serviceProvider;

    /**
     * 用作处理
     */
    @SneakyThrows
    public Object handler(RpcRequest request) {
        Object service = serviceProvider.getService(request.getInterfaceName());
        return invokeTargetMethod(request, service);
    }
}
```

`RpcRequestHandler`修改完后`NettyServerHandler`就会报错，这个简单，简单改下就好了。

```java
RpcRequestHandler bean = SpringUtil.getBean(RpcRequestHandler.class);
Object handler = bean.handler(rpcRequest);
```

## 再一次测试

惯例，先运行服务端，在运行客户端就会出现真正成功的效果了。

```java
11:57:38.224 [nioEventLoopGroup-2-1] INFO com.adouge.rpc.core.tool.netty.NettyClientHandler - 服务端返回数据: [RpcResponse(message=sb123)]
RpcResponse(message=sb123)
```

这篇有点长了，剩下部分分到下期吧。
