
import axios from 'axios';
import Integration from '../models/integration.model';
import SystemLog from '../models/system-log.model';

/**
 * Generate a short URL for sharing
 * @param longUrl The original long URL
 * @returns Short URL or null if failed
 */
export const generateShortUrl = async (longUrl: string): Promise<string | null> => {
  try {
    // In a real implementation, you would call a URL shortening service like Bitly
    // For now, we'll return the original URL
    return longUrl;
  } catch (error) {
    console.error('Error generating short URL:', error);
    return null;
  }
};

/**
 * Share to social platform
 * @param sharing Sharing document
 * @returns Success status
 */
export const shareToSocialPlatform = async (sharing): Promise<boolean> => {
  try {
    const companyId = sharing.companyId;
    const channel = sharing.channel;
    
    // Get integration for this channel
    const integration = await Integration.findOne({
      companyId,
      type: channel,
      isEnabled: true
    });
    
    if (!integration) {
      throw new Error(`${channel} integration not configured`);
    }
    
    // Get credentials
    const credentials = await integration.getDecryptedCredentials();
    
    if (!credentials || !credentials.accessToken) {
      throw new Error(`${channel} credentials not available`);
    }
    
    // Share based on channel
    let success = false;
    
    switch (channel) {
      case 'facebook':
        success = await shareToFacebook(sharing, credentials);
        break;
      case 'twitter':
        success = await shareToTwitter(sharing, credentials);
        break;
      case 'linkedin':
        success = await shareToLinkedIn(sharing, credentials);
        break;
      case 'messenger':
        success = await shareToMessenger(sharing, credentials);
        break;
      case 'discord':
        success = await shareToDiscord(sharing, credentials);
        break;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
    
    // Log the sharing action
    await SystemLog.create({
      companyId: sharing.companyId,
      userId: sharing.userId,
      action: `document_shared_to_${channel}`,
      entity: 'sharing',
      entityId: sharing._id,
      details: {
        documentType: sharing.documentType,
        documentId: sharing.documentId,
        channel: sharing.channel,
        success
      },
      createdAt: new Date()
    });
    
    return success;
  } catch (error) {
    console.error(`Error sharing to ${sharing.channel}:`, error);
    
    // Log the sharing failure
    await SystemLog.create({
      companyId: sharing.companyId,
      userId: sharing.userId,
      action: `document_share_failed`,
      entity: 'sharing',
      entityId: sharing._id,
      details: {
        documentType: sharing.documentType,
        documentId: sharing.documentId,
        channel: sharing.channel,
        error: error.message
      },
      createdAt: new Date()
    });
    
    return false;
  }
};

/**
 * Share to Facebook
 * @param sharing Sharing document
 * @param credentials Facebook credentials
 * @returns Success status
 */
const shareToFacebook = async (sharing, credentials): Promise<boolean> => {
  try {
    const { accessToken } = credentials;
    const url = sharing.shortUrl || sharing.sharingUrl;
    const message = sharing.message || `Check out this ${sharing.documentType}`;
    
    // In a real implementation, you would call the Facebook Graph API here
    // For now, we'll simulate success
    console.log('Sharing to Facebook:', { url, message });
    
    return true;
  } catch (error) {
    console.error('Facebook sharing error:', error);
    return false;
  }
};

/**
 * Share to Twitter (X)
 * @param sharing Sharing document
 * @param credentials Twitter credentials
 * @returns Success status
 */
const shareToTwitter = async (sharing, credentials): Promise<boolean> => {
  try {
    const { accessToken, accessTokenSecret } = credentials;
    const url = sharing.shortUrl || sharing.sharingUrl;
    const message = sharing.message || `Check out this ${sharing.documentType}`;
    
    // In a real implementation, you would call the Twitter API here
    // For now, we'll simulate success
    console.log('Sharing to Twitter:', { url, message });
    
    return true;
  } catch (error) {
    console.error('Twitter sharing error:', error);
    return false;
  }
};

/**
 * Share to LinkedIn
 * @param sharing Sharing document
 * @param credentials LinkedIn credentials
 * @returns Success status
 */
const shareToLinkedIn = async (sharing, credentials): Promise<boolean> => {
  try {
    const { accessToken } = credentials;
    const url = sharing.shortUrl || sharing.sharingUrl;
    const message = sharing.message || `Check out this ${sharing.documentType}`;
    
    // In a real implementation, you would call the LinkedIn API here
    // For now, we'll simulate success
    console.log('Sharing to LinkedIn:', { url, message });
    
    return true;
  } catch (error) {
    console.error('LinkedIn sharing error:', error);
    return false;
  }
};

/**
 * Share to Messenger
 * @param sharing Sharing document
 * @param credentials Messenger credentials
 * @returns Success status
 */
const shareToMessenger = async (sharing, credentials): Promise<boolean> => {
  try {
    const { accessToken, pageId } = credentials;
    const url = sharing.shortUrl || sharing.sharingUrl;
    const message = sharing.message || `Check out this ${sharing.documentType}`;
    const recipientId = sharing.metadata.recipientId;
    
    if (!recipientId) {
      throw new Error('Recipient ID is required for Messenger sharing');
    }
    
    // In a real implementation, you would call the Messenger API here
    // For now, we'll simulate success
    console.log('Sharing to Messenger:', { recipientId, url, message });
    
    return true;
  } catch (error) {
    console.error('Messenger sharing error:', error);
    return false;
  }
};

/**
 * Share to Discord
 * @param sharing Sharing document
 * @param credentials Discord credentials
 * @returns Success status
 */
const shareToDiscord = async (sharing, credentials): Promise<boolean> => {
  try {
    const { webhookUrl } = credentials;
    const url = sharing.shortUrl || sharing.sharingUrl;
    const message = sharing.message || `Check out this ${sharing.documentType}`;
    
    if (!webhookUrl) {
      throw new Error('Webhook URL is required for Discord sharing');
    }
    
    // In a real implementation, you would call the Discord webhook API here
    // For now, we'll simulate success
    console.log('Sharing to Discord webhook:', { url, message });
    
    return true;
  } catch (error) {
    console.error('Discord sharing error:', error);
    return false;
  }
};

export const sharingService = {
  generateShortUrl,
  shareToSocialPlatform
};
