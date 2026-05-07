---
title: 从零开始写RPC框架-01
description: 使用 Netty 实现 RPC 框架的第一步，搭建项目结构并实现客户端与服务端的基本通讯
pubDate: 2020-09-04T11:08:11.000Z
heroImage: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200
category: ["技术实践"]
draft: false
tags:
  - Java
  - RPC
  - Netty
---

> 感觉别人写这种文章都是先弄好在写，我这里是一步步来

先开个坑，就是自己在弄一个RPC框架的一个过程记录。

废话不多说,直接就开弄，废话不多说，先弄个Maven项目。

> 感觉这里要补一下什么是RPC

# 创建项目

![shadow](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/04/JeKr1O.png)

在我的设想下，这个RPC框架的子模块肯定是要有`Lombok`，所以在最大的`pom`上面加上他，然后顺手把那些没用的结构都删了。

然后创建三个模块，一个客户端（调用接口），一个服务端（接口实现），一个接口模块（接口提供）。

![shadow](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/09/04/c03KZc.png)

这里准备就基本上准备完了，下面开始撸代码。

先是把网络给联通了。

我这里就用`Netty`作为通讯了。

> 这里可能后面还会补一个Netty的文章

> 下面所有代码都在`adouge-rpc-tool`

肯定就是先添加`Netty`的坐标到`pom`

```xml
<dependency>
  <groupId>io.netty</groupId>
  <artifactId>netty-all</artifactId>
  <version>4.1.51.Final</version>
</dependency>
```

# 创建传输的报文

这个没什么可以说明的，就两个bean

```java
/**
 * 客户端请求用的
 * @author : Vinson
 * @date : 2020/9/4 1:11 下午
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RpcRequest {
    private String interfaceName;
    private String methodName;
		private Object[] args;
    private Class<?>[] parameterTypes;
}

```

```java
/**
 * 服务端返回用的
 * @author : Vinson
 * @date : 2020/9/4 1:12 下午
 */
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RpcResponse {
    private String message;
}
```

# 创建对应的编码器和解码器

## 序列化与反序列化

说到编码器和解码器肯定是要序列化嘛。

然后就撸一个序列化接口（方便后面切换序列化方式），我们用到的方法不多，就两个，编码和解码。

```java
public interface Serialize {
    /**
     * 序列化
     *
     * @param obj 要序列化的对象
     * @return 字节数组
     */
    byte[] serialize(Object obj);

    /**
     * 反序列化
     *
     * @param bytes 序列化后的字节数组
     * @param clazz 目标类
     * @param <T>   类的类型。举个例子,  {@code String.class} 的类型是 {@code Class<String>}.
     *              如果不知道类的类型的话，使用 {@code Class<?>}
     * @return 反序列化的对象
     */
    <T> T deserialize(byte[] bytes, Class<T> clazz);
}
```

然后写实现接口，我这里就用`kryo`。

> kryo是一个高性能的序列化/反序列化工具，由于其变长存储特性并使用了字节码生成机制，拥有较高的运行速度和较小的体积。

```xml
<dependency>
  <groupId>com.esotericsoftware</groupId>
  <artifactId>kryo</artifactId>
  <version>4.0.2</version>
</dependency>
```

### 线程安全问题

众所周知，Kryo线程不安全，这里有两种解决方案，一个`KryoPool`，另外一个是`ThreadLocal`，我选择用`ThreadLocal`。

```java
		private final ThreadLocal<Kryo> kryoThreadLocal=ThreadLocal.withInitial(()->{
        Kryo kryo = new Kryo();
        kryo.register(RpcResponse.class);
        kryo.register(RpcRequest.class);
        return kryo;
    });
```

解决了线程安全问题我们继续往下走，把编码和解码都实现了。

```java
		@Override
    @SneakyThrows
    public byte[] serialize(Object obj) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        Output output = new Output(bos);
        Kryo kryo = kryoThreadLocal.get();
        kryo.writeObject(output, obj);
        kryoThreadLocal.remove();
        return output.toBytes();
    }

    @Override
    @SneakyThrows
    public <T> T deserialize(byte[] bytes, Class<T> clazz) {
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        Input input=new Input(bis);
        Kryo kryo = kryoThreadLocal.get();
        kryoThreadLocal.remove();
        return kryo.readObject(input, clazz);
    }
```

回到正题，序列化和反序列化，其实上面就已经把具体来怎么编码解码弄好了，剩下就是把`MessageToByteEncoder`和`ByteToMessageDecoder`操作一下就好了。

```java
@AllArgsConstructor
public class NettyEncoder extends MessageToByteEncoder<Object> {

    private final Serialize serializer;
    private final Class<?> genericClass;

    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, Object o, ByteBuf byteBuf) throws Exception {
        if (genericClass.isInstance(o)) {
            byte[] body = serializer.serialize(o);
            int dataLength = body.length;
            byteBuf.writeInt(dataLength);
            byteBuf.writeBytes(body);
        }
    }
}
```

```java
@Slf4j
@AllArgsConstructor
public class NettyDecoder extends ByteToMessageDecoder {
    private final Serialize serializer;
    private final Class<?> genericClass;
    private static final int BODY_LENGTH=4;

    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf, List<Object> list) throws Exception {
        //如果连头部的大小都不够，肯定没有读取完整
        if(byteBuf.readableBytes()>=BODY_LENGTH){
            //标记readIndex位置，方便后面判断是否读取完整
            byteBuf.markReaderIndex();
            int dataLength = byteBuf.readInt();
            if(dataLength<0||byteBuf.readableBytes()<0){
                log.error("data为空或刻度直接少于0！");
                return;
            }
            if(byteBuf.readableBytes()<dataLength){
                log.debug("数据还不完整。");
                byteBuf.resetReaderIndex();
            }
            byte[] body = new byte[dataLength];
            byteBuf.readBytes(body);
            list.add(serializer.deserialize(body, genericClass));
        }
    }
}
```

# 创建服务端和客户端的处理器

这块的话就是`Netty`在调用前后的一个处理器，客户端有对应的服务端也应该有。

同样的继承与`ChannelInboundHandlerAdapter`实现`channelRead`的读取方法，对传输过来的报文进行解析。

## 服务端

```java
@Slf4j
public class NettyServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        super.channelRead(ctx, msg);
        try {
            RpcRequest rpcRequest = (RpcRequest) msg;
            log.info("服务端接收到信息: [{}] ", rpcRequest);
            RpcResponse messageFromServer = RpcResponse.builder().message("message from server").build();
            ChannelFuture f = ctx.writeAndFlush(messageFromServer);
            f.addListener(ChannelFutureListener.CLOSE);
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }
}

```

## 客户端

```java
@Slf4j
public class NettyClientHandler extends ChannelInboundHandlerAdapter {

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        super.channelRead(ctx, msg);
        try {
            RpcResponse rpcResponse = (RpcResponse) msg;
            log.info("服务端返回数据: [{}]", rpcResponse.toString());
            AttributeKey<RpcResponse> key = AttributeKey.valueOf("rpcResponse");
            ctx.channel().attr(key).set(rpcResponse);
            ctx.channel().close();
        } finally {
            ReferenceCountUtil.release(msg);
        }
    }
}
```

# 创建服务端和客户端

​ 前面那块就是为了创建这两个端，先说服务端吧。

## 服务端

首先在`adouge-rpc-server`创建`NettyServer`

```java
@Slf4j
@RequiredArgsConstructor
public class NettyServer {

    private final int port;

    public void run(){
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        KryoSerializer kryoSerializer = new KryoSerializer();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childOption(ChannelOption.TCP_NODELAY, true)
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .handler(new LoggingHandler(LogLevel.INFO))
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new NettyDecoder(kryoSerializer, RpcRequest.class));
                            ch.pipeline().addLast(new NettyEncoder(kryoSerializer, RpcResponse.class));
                            ch.pipeline().addLast(new NettyServerHandler());
                        }
                    });

            ChannelFuture f = b.bind(port).sync();
            f.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            log.error("无法启动服务:", e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

```

> 注意解码对`RpcRequest`编码对`RpcResponse`就可以了，其他都是套路

## 客户端

然后在`adouge-rpc-client`创建`NettyClient`

```java
@Slf4j
@RequiredArgsConstructor
public class NettyClient {
    private final String host;
    private final int port;
    private static final Bootstrap b;

    static {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        b = new Bootstrap();
        KryoSerializer kryoSerializer = new KryoSerializer();
        b.group(eventLoopGroup)
                .channel(NioSocketChannel.class)
                .handler(new LoggingHandler(LogLevel.INFO))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new NettyDecoder(kryoSerializer, RpcResponse.class));
                        ch.pipeline().addLast(new NettyEncoder(kryoSerializer, RpcRequest.class));
                        ch.pipeline().addLast(new NettyClientHandler());
                    }
                });
    }

    public RpcResponse send(RpcRequest request) {
        try {
            ChannelFuture f = b.connect(host, port).sync();
            log.info("客户端链接  {}", host + ":" + port);
            Channel futureChannel = f.channel();
            if (futureChannel != null) {
                futureChannel.writeAndFlush(request).addListener(future -> {
                    if (future.isSuccess()) {
                        log.info("客户端发送信息: [{}]", request.toString());
                    } else {
                        log.error("发送失败:", future.cause());
                    }
                });
                futureChannel.closeFuture().sync();
                AttributeKey<RpcResponse> key = AttributeKey.valueOf("rpcResponse");
                return futureChannel.attr(key).get();
            }
        } catch (InterruptedException e) {
            log.error("无法链接服务端:", e);
        }
        return null;
    }
}
```

> 注意解码对`RpcResponse`编码对`RpcRequset`就可以了，其他都是套路

写了这么一大堆东西，终于可以测试了。

# 测试客户端和服务端

在`adouge-rpc-server`和`adouge-rpc-client`创建对应的测试类

> junit就不用说了吧

```java
		@Test
    public void testRun(){
        new NettyServer(6666).run();
    }
		
		
		@Test
    public void testSend(){
        System.out.println(new NettyClient("localhost",6666).send(RpcRequest.builder().interfaceName("1234").build()));
    }
```

> 注意先后顺序。

在执行完`testSend`后你就会看到在`NettyServerHandler`定义的`与服务端通讯成功`被输出到控制台。到这里我们的`RPC`~~~就完成了~~~完成第一步。
