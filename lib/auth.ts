import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// JWTトークンのペイロード型
export interface JWTPayload {
  id: string
  type: 'customer' | 'admin'
  phoneNumber?: string
  email?: string
}

// JWT認証関連のユーティリティ関数
export class AuthUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'
  private static readonly SALT_ROUNDS = 10

  // パスワードをハッシュ化
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  // パスワードを検証
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // JWTトークンを生成
  static generateToken(payload: JWTPayload): string {
    if (!this.JWT_SECRET || this.JWT_SECRET === 'your-secret-key-change-in-production') {
      throw new Error('JWT_SECRET is not set or is using default value')
    }
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN || '24h',
    } as jwt.SignOptions)
  }

  // JWTトークンを検証
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload
      return decoded
    } catch (error) {
      return null
    }
  }

  // リクエストヘッダーからトークンを取得
  static getTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }
}

