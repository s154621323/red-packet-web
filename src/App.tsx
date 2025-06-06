import { useAccount, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { CreatePacket } from './components/CreatePacket'
import { ClaimPacket } from './components/ClaimPacket'
import { useRedPacket } from './hooks/useRedPacket'
import { ConnectKitButton } from "connectkit";

function App() {
  const account = useAccount()
  const { disconnect } = useDisconnect()

  // 获取红包合约
  const {
    packets,
    isLoadingPackets,
    isPending,
    createPacket,
    claimPacket,
    fetchPacketsList
  } = useRedPacket()

  // 活动标签页
  const [activeTab, setActiveTab] = useState('create')

  // 处理发送红包
  const handleCreatePacket = (amount: string, count: string) => {
    createPacket(amount, count)
  };

  // 处理领取红包
  const handleClaimPacket = (id: string) => {
    claimPacket(id)
  };

  return (
    <div className="red-packet-app">
      <div className="red-packet-bg"></div>
      <div className="red-packet-decoration left"></div>
      <div className="red-packet-decoration right"></div>

      <header>
        <h1>区块链红包</h1>
        <div className="account-status">
          {account.status === 'connected' ? (
            <div className="connected">
              <span className="address">{account.addresses?.[0]?.slice(0, 6)}...{account.addresses?.[0]?.slice(-4)}</span>
              <button className="disconnect-btn" onClick={() => disconnect()}>断开连接</button>
            </div>
          ) : (
            <div className="connect-btns">
              <ConnectKitButton />
            </div>
          )}
        </div>
      </header>

      {account.status === 'connected' ? (
        <main>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
              disabled={isPending}
            >
              <span className="tab-icon">🧧</span>
              发红包
            </button>
            <button
              className={`tab ${activeTab === 'claim' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('claim');
                fetchPacketsList();
              }}
              disabled={isPending}
            >
              <span className="tab-icon">💰</span>
              领红包
            </button>
          </div>

          {isPending && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>交易处理中...</p>
            </div>
          )}

          <div className="tab-content">
            {activeTab === 'create' ? (
              <CreatePacket onSubmit={handleCreatePacket} />
            ) : (
              <ClaimPacket
                onSubmit={handleClaimPacket}
                packets={packets}
                isLoading={isLoadingPackets}
              />
            )}
          </div>
        </main>
      ) : (
        <div className="connect-prompt">
          <div className="connect-icon">🧧</div>
          <h2>请先连接钱包</h2>
          <p>连接您的钱包以发送或领取红包</p>
        </div>
      )}
    </div>
  )
}

export default App
