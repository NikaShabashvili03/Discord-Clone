export interface SafeUser { 
    id: string
    name: string
    username: string
    email: string
    cover: string
    emailVerified: Date
    image: string
    hashedPassword: string
    createdAt: Date
    updatedAt: Date

    conversationIds: Array<string>
    conversations: Array<SafeConversations>

    seenMessageIds: Array<string>
    seenMessages: Array<SafeMessage>

    messages: Array<SafeMessage>

    pending: Array<SafePending>
    pendings: Array<SafePending>

    friend: Array<SafeFriend>
    friends: Array<SafeFriend>
}


export interface SafeConversations {
    id: string
    createdAt: Date
    lastMessageAt: Date
    name: string
    isGroup: boolean

    messagesIds: Array<string>
    messages: Array<SafeMessage>

    userIds: Array<string>
    users:  Array<SafeUser>
}


export interface SafeMessage {
    id: string
    body: string
    image: string
    createdAt: Date

    seenIds: Array<string>
    seen: Array<SafeUser>

    conversationIds: string
    conversations: Array<SafeConversations>

    senderIds: string
    sender:  SafeUser
}

export interface SafePending {
    id: string

    userId: string
    user: SafeUser

    fromId: string
    from: SafeUser
}

export interface SafeFriend {
    id: string

    userId: string
    user: SafeUser

    friendId: string
    friend: SafeUser
}