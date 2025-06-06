import { useState } from 'react';

interface CreatePacketProps {
  onSubmit?: (amount: string, count: string) => void;
}

export function CreatePacket({ onSubmit }: CreatePacketProps) {
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnimating(true);

    // 动画效果后再提交
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(amount, count);
      }
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className="create-packet">
      <h2>发红包</h2>
      {
        isAnimating && (
          <div className={`packet-animation-container animate`}>
            <div className="packet-animation">
              <div className="packet-icon">🧧</div>
            </div>
          </div>
        )
      }
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">红包金额（ETH）</label>
          <div className="input-wrapper">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.001"
              placeholder="请输入红包金额"
              required
            />
            <span className="input-icon">💎</span>
          </div>
          <div className="input-hint">输入您想要发送的以太币数量</div>
        </div>
        <div className="form-group">
          <label htmlFor="count">红包数量</label>
          <div className="input-wrapper">
            <input
              id="count"
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              placeholder="请输入红包数量"
              required
            />
            <span className="input-icon">👥</span>
          </div>
          <div className="input-hint">红包将会平均分配给领取的人</div>
        </div>
        <button type="submit" className="primary-btn" disabled={isAnimating}>
          {isAnimating ? '准备中...' : '发送红包'}
        </button>
      </form>
    </div>
  );
} 