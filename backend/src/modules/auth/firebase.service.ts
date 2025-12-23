import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('firebase.projectId');
    const clientEmail = this.configService.get<string>('firebase.clientEmail');
    const privateKey = this.configService.get<string>('firebase.privateKey');

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'Firebase credentials not configured. Firebase authentication will be disabled.',
      );
      return;
    }

    try {
      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.app = admin.apps[0]!;
      } else {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      this.logger.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    try {
      return await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      this.logger.error('Failed to verify Firebase ID token', error);
      throw error;
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    return admin.auth().getUser(uid);
  }

  async createUser(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<admin.auth.UserRecord> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    return admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
  }

  async deleteUser(uid: string): Promise<void> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    await admin.auth().deleteUser(uid);
  }

  async updateUser(
    uid: string,
    properties: admin.auth.UpdateRequest,
  ): Promise<admin.auth.UserRecord> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    return admin.auth().updateUser(uid, properties);
  }

  isInitialized(): boolean {
    return !!this.app;
  }
}
