export interface User {
  _id?: string
  walletAddress: string
  name?: string
  role: "admin" | "ngo" | "volunteer" | "citizen"
  createdAt: Date
  updatedAt: Date
}

export interface DistributionCenter {
  _id?: string
  name: string
  location: {
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  trustScore: number
  createdAt: Date
  updatedAt: Date
}

export interface Distribution {
  _id?: string
  distributionId: string
  centerId: string
  centerName: string
  commodity: string
  quantity: string
  date: string
  time: string
  status: "scheduled" | "in-progress" | "completed" | "verified" | "pending"
  txHash?: string
  verifiedBy?: string
  geoVerified: boolean
  geoLocation?: {
    latitude: number
    longitude: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface Grievance {
  _id?: string
  grievanceId: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved"
  date: string
  userId: string
  userName: string
  centerId: string
  centerName: string
  txHash?: string
  assignedTo?: string
  resolution?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  _id?: string
  txHash: string
  type: "distribution" | "verification" | "grievance"
  referenceId: string
  walletAddress: string
  timestamp: Date
  status: "pending" | "confirmed" | "failed"
  blockNumber?: number
  createdAt: Date
  updatedAt: Date
}
