'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2 } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LoaderConfig {
  enabled: boolean;
  delay?: number;
  duration?: number;
}

export interface Link {
  text: string;
}

export interface Message {
  id: number | string;
  sender: 'left' | 'right';
  type: 'text' | 'image' | 'text-with-links' | 'consultation';
  content: string;
  maxWidth?: string;
  loader?: LoaderConfig;
  links?: Link[];
  consultationInfo?: any;
  onCloseConsultation?: () => void;
}

export interface Person {
  name: string;
  avatar: string;
}

export interface ChatStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  showBorder: boolean;
  nameColor?: string;
}

export interface LinkBubbleStyle {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
}

export interface UiConfig {
  containerWidth?: number | string;
  containerHeight?: number | string;
  backgroundColor?: string;
  autoRestart?: boolean;
  restartDelay?: number;
  loader?: {
    dotColor?: string;
  };
  linkBubbles?: LinkBubbleStyle;
  leftChat?: ChatStyle;
  rightChat?: ChatStyle;
}

export interface ChatConfig {
  leftPerson: Person;
  rightPerson: Person;
  messages: Message[];
}

interface ChatComponentProps {
  config: ChatConfig;
  uiConfig?: UiConfig;
  renderCustomMessage?: (message: Message) => React.ReactNode;
}

interface MessageLoaderProps {
  dotColor?: string;
}

interface LinkBadgeProps {
  link: Link;
  linkStyle: LinkBubbleStyle;
}

interface MessageBubbleProps {
  message: Message;
  isLeft: boolean;
  uiConfig: Required<UiConfig>;
  onContentReady?: () => void;
  isLoading: boolean;
  isVisible: boolean;
  renderCustomMessage?: (message: Message) => React.ReactNode;
}

interface MessageWrapperProps {
  message: Message;
  config: ChatConfig;
  uiConfig: Required<UiConfig>;
  previousMessageComplete: boolean;
  onMessageComplete?: (messageId: string | number) => void;
  previousMessage: Message | null;
  nextMessage: Message | null;
  onVisibilityChange?: (messageId: string | number) => void;
  isNextVisible: boolean;
  renderCustomMessage?: (message: Message) => React.ReactNode;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MessageLoader = React.memo<MessageLoaderProps>(({ dotColor = '#9ca3af' }) => {
  const dotAnimation = {
    y: [0, -6, 0]
  };

  const dotTransition = (delay = 0) => ({
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay
  });

  return (
    <motion.div
      className="flex items-center gap-1 px-3 py-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
          animate={dotAnimation}
          transition={dotTransition(delay)}
        />
      ))}
    </motion.div>
  );
});

MessageLoader.displayName = 'MessageLoader';

const LinkBadge = React.memo<LinkBadgeProps>(({ link, linkStyle }) => (
  <div
    className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs border tracking-wider"
    style={{
      backgroundColor: linkStyle.backgroundColor,
      color: linkStyle.textColor,
      borderColor: linkStyle.borderColor
    }}
  >
    <Link2 size={12} color={linkStyle.iconColor} />
    <span>{link.text}</span>
  </div>
));

LinkBadge.displayName = 'LinkBadge';

const MarkdownText = ({ text, color }: { text: string; color: string }) => {
  if (!text) return null;
  
  // Simple markdown-like formatter for **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <span style={{ color }}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} style={{ fontWeight: 700, color: 'inherit', filter: 'brightness(0.9)' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
};

// ============================================================================
// MESSAGE BUBBLE COMPONENT
// ============================================================================

const MessageBubble = React.memo<MessageBubbleProps>(({ 
  message, isLeft, uiConfig, onContentReady, isLoading, isVisible, renderCustomMessage 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const chatStyle = isLeft ? uiConfig.leftChat! : uiConfig.rightChat!;

  useEffect(() => {
    if (isVisible && (message.type === 'text' || message.type === 'text-with-links')) {
      onContentReady?.();
    }
  }, [isVisible, message.type, onContentReady]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onContentReady?.();
  }, [onContentReady]);

  const bubbleStyle = useMemo(() => ({
    backgroundColor: chatStyle.backgroundColor,
    color: chatStyle.textColor,
    borderColor: chatStyle.borderColor,
    borderWidth: chatStyle.showBorder ? '0.5px' : '0'
  }), [chatStyle.backgroundColor, chatStyle.textColor, chatStyle.borderColor, chatStyle.showBorder]);

  const roundedClass = isLeft
    ? "rounded-2xl rounded-bl-sm"
    : "rounded-2xl rounded-br-sm";

  const paddingClass = message.type === 'image' ? 'p-1' : 'p-3 px-4';
  const maxWidthClass = message.maxWidth || 'max-w-[85%]';

  return (
    <div
      className={`${roundedClass} ${paddingClass} ${maxWidthClass} border-solid relative shadow-sm`}
      style={bubbleStyle}
    >
      <AnimatePresence mode="wait">
        {isLoading && !isVisible ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center min-h-[32px]"
          >
            <MessageLoader dotColor={uiConfig.loader?.dotColor} />
          </motion.div>
        ) : isVisible ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message.type === 'text' && (
              <p className="text-[14px] leading-relaxed">
                <MarkdownText text={message.content} color={chatStyle.textColor} />
              </p>
            )}

            {message.type === 'image' && (
              <div className="relative min-h-[120px]">
                {!imageLoaded && (
                  <div className="w-full h-32 flex items-center justify-center">
                    <MessageLoader dotColor={uiConfig.loader?.dotColor} />
                  </div>
                )}
                <img
                  src={message.content}
                  alt="Chat image"
                  className={`rounded-xl max-h-full max-w-full h-auto object-cover ${!imageLoaded ? 'hidden' : ''}`}
                  onLoad={handleImageLoad}
                />
              </div>
            )}

            {message.type === 'text-with-links' && (
              <div>
                <p className="text-[14px] leading-relaxed mb-3">
                  <MarkdownText text={message.content} color={chatStyle.textColor} />
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {message.links?.map((link, index) => (
                    <LinkBadge key={index} link={link} linkStyle={uiConfig.linkBubbles!} />
                  ))}
                </div>
              </div>
            )}

            {message.type === 'consultation' && renderCustomMessage && (
              <div className="w-full min-w-[300px]">
                {renderCustomMessage(message)}
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// ============================================================================
// MESSAGE WRAPPER COMPONENT
// ============================================================================

const MessageWrapper = React.memo<MessageWrapperProps>(({
  message,
  config,
  uiConfig,
  previousMessageComplete,
  onMessageComplete,
  previousMessage,
  nextMessage,
  onVisibilityChange,
  isNextVisible,
  renderCustomMessage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messageCompleted, setMessageCompleted] = useState(false);

  const isLeft = message.sender === 'left';
  const person = isLeft ? config.leftPerson : config.rightPerson;
  const chatStyle = isLeft ? uiConfig.leftChat! : uiConfig.rightChat!;

  const isContinuation = previousMessage?.sender === message.sender;
  const nextMessageSameSender = nextMessage?.sender === message.sender;
  const shouldShowAvatar = !nextMessageSameSender || !isNextVisible;

  useEffect(() => {
    if (!previousMessageComplete) return;

    const { loader } = message;
    const loaderDelay = isLeft ? 400 : 0; 
    const totalDelay = loaderDelay + (loader?.duration || 800);

    if (loader?.enabled) {
      const loaderTimeout = setTimeout(() => setIsLoading(true), loaderDelay);
      const messageTimeout = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
        onVisibilityChange?.(message.id);
      }, totalDelay);

      return () => {
        clearTimeout(loaderTimeout);
        clearTimeout(messageTimeout);
      };
    } else {
      const messageTimeout = setTimeout(() => {
        setIsVisible(true);
        onVisibilityChange?.(message.id);
      }, loaderDelay);

      return () => clearTimeout(messageTimeout);
    }
  }, [message, previousMessageComplete, onVisibilityChange, isLeft]);

  const handleContentReady = useCallback(() => {
    if (!messageCompleted) {
      setMessageCompleted(true);
      setTimeout(() => onMessageComplete?.(message.id), 300);
    }
  }, [messageCompleted, onMessageComplete, message.id]);

  const messageClass = useMemo(() =>
    isLeft ? "flex items-end gap-3 w-full" : "flex items-end gap-3 flex-row-reverse w-full",
    [isLeft]
  );

  if (!isLoading && !isVisible) return null;

  return (
    <div className={messageClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          opacity: { duration: 0.2 }
        }}
        className="flex flex-col"
        style={{ alignItems: isLeft ? 'flex-start' : 'flex-end', maxWidth: '100%' }}
      >
        {!isContinuation && (
          <motion.div
            className="text-[10px] font-bold uppercase tracking-wider mb-1 px-1"
            style={{ color: chatStyle.nameColor || '#94a3b8' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {person.name}
          </motion.div>
        )}

        <MessageBubble
          message={message}
          isLeft={isLeft}
          uiConfig={uiConfig}
          onContentReady={handleContentReady}
          isLoading={isLoading}
          isVisible={isVisible}
          renderCustomMessage={renderCustomMessage}
        />
      </motion.div>
    </div>
  );
});

MessageWrapper.displayName = 'MessageWrapper';

// ============================================================================
// MAIN CHAT COMPONENT
// ============================================================================

const ChatInterface: React.FC<ChatComponentProps> = ({ config, uiConfig = {}, renderCustomMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [completedMessages, setCompletedMessages] = useState<(number | string)[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<(number | string)[]>([]);
  const [key, setKey] = useState(0);

  const defaultUiConfig: Required<UiConfig> = {
    containerWidth: '100%',
    containerHeight: 500,
    backgroundColor: '#ffffff',
    autoRestart: false,
    restartDelay: 3000,
    loader: { dotColor: '#0068ff' },
    linkBubbles: {
      backgroundColor: '#f1f5f9',
      textColor: '#475569',
      iconColor: '#0068ff',
      borderColor: '#e2e8f0'
    },
    leftChat: {
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      borderColor: '#e2e8f0',
      showBorder: true,
      nameColor: '#64748b'
    },
    rightChat: {
      backgroundColor: '#0068ff',
      textColor: '#ffffff',
      borderColor: '#0056d2',
      showBorder: false,
      nameColor: '#93c5fd'
    }
  };

  const ui: Required<UiConfig> = { ...defaultUiConfig, ...uiConfig } as Required<UiConfig>;

  const handleMessageComplete = useCallback((messageId: number | string) => {
    setCompletedMessages(prev => {
      const newCompleted = [...prev, messageId];
      if (newCompleted.length === config.messages.length && ui.autoRestart) {
        setTimeout(() => {
          setCompletedMessages([]);
          setVisibleMessages([]);
          setKey(prevKey => prevKey + 1);
        }, ui.restartDelay);
      }
      return newCompleted;
    });
  }, [config.messages.length, ui.autoRestart, ui.restartDelay]);

  const handleVisibilityChange = useCallback((messageId: number | string) => {
    setVisibleMessages(prev =>
      prev.includes(messageId) ? prev : [...prev, messageId]
    );
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(scrollToBottom);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [key, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [config.messages, completedMessages, scrollToBottom]);

  const gradientBackground = useMemo(() => {
    return `linear-gradient(to bottom, ${hexToRgba(ui.backgroundColor, 1)} 0%, ${hexToRgba(ui.backgroundColor, 0.9)} 40%, ${hexToRgba(ui.backgroundColor, 0)} 100%)`;
  }, [ui.backgroundColor]);

  return (
    <div
      key={key}
      className="mx-auto rounded-xl relative overflow-hidden"
      style={{
        width: typeof ui.containerWidth === 'number' ? `${ui.containerWidth}px` : ui.containerWidth,
        height: typeof ui.containerHeight === 'number' ? `${ui.containerHeight}px` : ui.containerHeight,
        backgroundColor: ui.backgroundColor
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-10"
        style={{ background: gradientBackground }}
      />

      <div
        ref={containerRef}
        className="p-4 md:p-6 overflow-y-auto h-full scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          div::-webkit-scrollbar { display: none; }
        `}} />

        <div className="min-h-full flex flex-col justify-end space-y-4">
          {config.messages.map((message, index) => {
            const previousMessageComplete = index === 0 || completedMessages.includes(config.messages[index - 1].id);
            const previousMessage = index > 0 ? config.messages[index - 1] : null;
            const nextMessage = index < config.messages.length - 1 ? config.messages[index + 1] : null;
            const isNextVisible = nextMessage ? visibleMessages.includes(nextMessage.id) : false;
            const isContinuation = previousMessage?.sender === message.sender;

            const spacingClass = index === 0 ? "" : (isContinuation ? "pt-1" : "pt-4");

            return (
              <div key={message.id} className={spacingClass}>
                <MessageWrapper
                  message={message}
                  config={config}
                  uiConfig={ui}
                  previousMessageComplete={previousMessageComplete}
                  onMessageComplete={handleMessageComplete}
                  onVisibilityChange={handleVisibilityChange}
                  previousMessage={previousMessage}
                  nextMessage={nextMessage}
                  isNextVisible={isNextVisible}
                  renderCustomMessage={renderCustomMessage}
                />
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
