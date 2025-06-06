import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { RedPacketABI, contractAddress } from '../contract'
import { useState, useEffect } from 'react'
import { getPublicClient } from '@wagmi/core'
import { config } from "../config"

// 红包类型定义
export interface RedPacket {
  id: string;
  creator: string;
  amount: string;
  count: string;
  remainingCount: string;
  claimed: boolean;
}

export function useRedPacket() {
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract()
  const [packets, setPackets] = useState<RedPacket[]>([])
  const [isLoadingPackets, setIsLoadingPackets] = useState(false)

  const { address } = useAccount()

  // 读取红包列表
  const {
    data: packetsData,
    refetch: refetchPackets
  } = useReadContract({
    abi: RedPacketABI,
    address: contractAddress as `0x${string}`,
    functionName: 'getPackets'
  })

  // 创建红包
  const createPacket = async (amount: string, count: string) => {
    if (!amount || !count) return

    const amountInWei = parseEther(amount)
    const countBigInt = BigInt(count)
    try {
      await writeContract({
        abi: RedPacketABI,
        address: contractAddress as `0x${string}`,
        functionName: 'createPacket',
        args: [amountInWei, countBigInt],
        value: amountInWei,
      })

      // 刷新数据
      fetchPacketsList()

      return true
    } catch (error) {
      console.error('创建红包失败:', error)
      return false
    }
  }

  // 领取红包
  const claimPacket = async (packetId: string) => {
    if (!packetId) return

    try {
      await writeContract({
        abi: RedPacketABI,
        address: contractAddress as `0x${string}`,
        functionName: 'claimPacket',
        args: [BigInt(packetId)],
      })

      // 刷新红包列表
      fetchPacketsList()

      return true
    } catch (error) {
      console.error('领取红包失败:', error)
      return false
    }
  }

  // 获取红包列表
  const fetchPacketsList = async () => {
    setIsLoadingPackets(true)

    try {
      await refetchPackets()
      if (packetsData && address) {
        const publicClient = getPublicClient(config)!
        const validPackets = (packetsData as any[])
          .filter(packet => packet.creator !== '0x0000000000000000000000000000000000000000')
        // 并发查询每个红包的领取状态
        const claimStatusList = await Promise.all(
          validPackets.map(packet =>
            publicClient.readContract({
              abi: RedPacketABI,
              address: contractAddress as `0x${string}`,
              functionName: 'packetClaims',
              args: [BigInt(packet.id), address]
            })
          )
        )
        const formattedPackets: RedPacket[] = validPackets.map((packet, idx) => ({
          id: packet.id.toString(),
          creator: packet.creator,
          amount: formatEther(packet.amount),
          count: packet.total.toString(),
          remainingCount: packet.count.toString(),
          claimed: claimStatusList[idx] as boolean
        }))
        setPackets(formattedPackets)
      }
    } catch (error) {
      console.error('获取红包列表失败:', error)
    } finally {
      setIsLoadingPackets(false)
    }
  }

  // 初始加载和刷新红包列表
  useEffect(() => {
    fetchPacketsList()
  }, [packetsData, address, refetchPackets])

  return {
    packets,
    isLoadingPackets,
    isPending: isWritePending,
    error: writeError,
    createPacket,
    claimPacket,
    fetchPacketsList,
  }
} 