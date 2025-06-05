
const { OAuth2Client } = require('google-auth-library');

class GoogleAuthService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
  }

  async verifyIdToken(idToken) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_WEB_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.sub) {
        throw new Error('Invalid Google token');
      }

      return {
        id: payload.sub,
        email: payload.email,
        given_name: payload.given_name || 'User',
        family_name: payload.family_name || 'Name',
        picture: payload.picture,
        email_verified: payload.email_verified
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new Error('Invalid Google token');
    }
  }
}

module.exports = GoogleAuthService;
