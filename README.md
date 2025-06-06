# 以太坊红包DApp前端

这是一个基于React和Wagmi的以太坊红包DApp前端项目，用于与红包智能合约交互。

## 功能

- 连接以太坊钱包
- 创建红包：指定金额和份数
- 领取红包：查看可领取的红包列表并领取
- 查看红包状态：包括创建者、金额、剩余份数等信息

## 技术栈

- React 18
- TypeScript
- Vite
- Wagmi & Viem (以太坊交互)
- ConnectKit (钱包连接UI)
- SASS (样式)

## 项目结构

- `src/components/` - React组件
  - `CreatePacket.tsx` - 创建红包组件
  - `ClaimPacket.tsx` - 领取红包组件
- `src/hooks/` - 自定义React Hooks
  - `useRedPacket.ts` - 红包合约交互逻辑
- `src/contract.ts` - 合约ABI和地址
- `src/config.ts` - Wagmi配置
- `src/App.tsx` - 主应用组件

## 开发设置

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建项目
```bash
npm run build
```

## 使用

1. 确保已安装MetaMask或其他以太坊钱包
2. 连接到本地区块链网络（如Ganache，端口7545）
3. 确保红包智能合约已部署，并更新`contract.ts`中的合约地址
4. 使用界面创建红包和领取红包

## 许可证

MIT
