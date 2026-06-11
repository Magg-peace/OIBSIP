import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import { sendLowStockAlertEmail } from './emailService.js';

export const initCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled inventory stock level checks...');
    try {
      const allItems = await Inventory.find();
      
      const lowStockItems = allItems.filter(item => item.quantity <= item.threshold);
      if (lowStockItems.length > 0) {
        console.log(`Found ${lowStockItems.length} low stock items. Sending alert...`);
        await sendLowStockAlertEmail(lowStockItems);
      } else {
        console.log('All inventory items are above thresholds.');
      }
    } catch (error) {
      console.error('Error running inventory cron check:', error);
    }
  });

  console.log('Cron Jobs Initialized (Inventory Monitor: hourly).');
};
