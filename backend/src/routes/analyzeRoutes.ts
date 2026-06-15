import { Router } from 'express';
import { 
  analyzeProject, 
  getReportById, 
  getAllReports, 
  checkHealth 
} from '../controllers/analyzeController';

const router = Router();

router.post('/analyze', analyzeProject);
router.get('/report/:id', getReportById);
router.get('/reports', getAllReports);
router.get('/health', checkHealth);

export default router;
