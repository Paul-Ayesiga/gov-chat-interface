import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image } from 'lucide-react';

interface DropOverlayProps {
  isVisible: boolean;
  isDragActive: boolean;
}

export function DropOverlay({ isVisible, isDragActive }: DropOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          
          {/* Drop zone */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: isDragActive ? 1.05 : 1 }}
            className={`
              relative bg-card border-2 border-dashed rounded-2xl p-12 max-w-md mx-4
              transition-colors duration-200 shadow-floating
              ${isDragActive 
                ? 'border-gov-blue bg-gov-blue/5' 
                : 'border-border'
              }
            `}
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className={`
                  w-16 h-16 mx-auto rounded-full flex items-center justify-center
                  ${isDragActive 
                    ? 'bg-gov-blue text-white' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                <Upload className="w-8 h-8" />
              </motion.div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Drop files to upload'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports documents, images, and text files
                </p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="w-4 h-4" />
                    <span>Images</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}