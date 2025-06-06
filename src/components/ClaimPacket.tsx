import { useState } from 'react';
import { RedPacket } from '../hooks/useRedPacket';

interface ClaimPacketProps {
  onSubmit?: (packetId: string) => void;
  packets?: RedPacket[];
  isLoading?: boolean;
}

export function ClaimPacket({ onSubmit, packets = [], isLoading = false }: ClaimPacketProps) {
  const [selectedPacket, setSelectedPacket] = useState<RedPacket | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClaim = (packet: RedPacket) => {
    if (packet.claimed || packet.remainingCount === '0') return;

    setSelectedPacket(packet);
    setIsAnimating(true);

    // 动画效果后再提交
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(packet.id);
      }
      setIsAnimating(false);
      setSelectedPacket(null);
    }, 800);
  };

  return (
    <div className="claim-packet">
      <h2>可领取的红包</h2>

      {selectedPacket && (
        <div className={`packet-animation-container ${isAnimating ? 'animate' : ''}`}>
          <div className="packet-animation claim">
            <div className="packet-icon">💰</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="packets-loading">
          <div className="loading-spinner"></div>
          <p>正在加载红包列表...</p>
        </div>
      ) : packets.length === 0 ? (
        <div className="no-packets">
          <div className="no-packets-icon">📭</div>
          <p>暂无可领取的红包</p>
        </div>
      ) : (
        <div className="packets-list">
          {packets.map((packet) => {
            const isDisabled = packet.claimed || packet.remainingCount === '0';

            return (
              <div
                key={packet.id}
                className={`packet-item ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleClaim(packet)}
              >
                <div className="packet-item-icon">🧧</div>
                <div className="packet-item-content">
                  <div className="packet-item-header">
                    <div className="packet-item-id">红包 #{packet.id}</div>
                    <div className={`packet-item-status ${isDisabled ? 'empty' : ''}`}>
                      {packet.claimed ? '已领取' :
                        packet.remainingCount === '0' ? '已抢完' : `剩余 ${packet.remainingCount}/${packet.count}`}
                    </div>
                  </div>
                  <div className="packet-item-info">
                    <div className="packet-item-amount">{packet.amount} ETH</div>
                    <div className="packet-item-creator">
                      <span className="creator-label">from:</span>
                      <span className="creator-address">{packet.creator}</span>
                    </div>
                  </div>
                </div>
                {!isDisabled && (
                  <div className="packet-item-action">
                    <span className="action-text">领取</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 