import { useEffect, useRef } from 'react';
import { Application, Graphics, Text, TextStyle } from 'pixi.js';

interface Option {
  text: string;
  frequency: number;
}

interface PixiFlickerProps {
  options: Option[];
  numOptions: number;
  isPlaying: boolean;
  questionText: string;
}

interface BoxEntry {
  box: Graphics;
  text: Text;
}

export function PixiFlicker({
  options,
  numOptions,
  isPlaying,
  questionText,
}: PixiFlickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const boxesRef = useRef<BoxEntry[]>([]);
  const startTimeRef = useRef<number>(0);
  const questionTextRef = useRef<Text | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let animationId: number;
    let isInitialized = false;

    const initializePixi = async () => {
      try {
        if (appRef.current) {
          appRef.current.destroy();
        }

        const app = new Application();

        await app.init({
          width: containerRef.current!.clientWidth,
          height: containerRef.current!.clientHeight,
          backgroundColor: 0xdcdcdc,
          antialias: true,
        });

        containerRef.current!.innerHTML = '';
        containerRef.current!.appendChild(app.canvas);
        appRef.current = app;

        const cols = numOptions <= 4 ? 2 : numOptions === 5 ? 2 : 3;
        const rows = numOptions <= 4 ? 2 : numOptions === 5 ? 3 : 2;

        const padding = 32;
        const gap = 16;
        const boxWidth =
          (app.screen.width - padding * 2 - gap * (cols - 1)) / cols;
        const boxHeight =
          (app.screen.height - 120 - padding * 2 - gap * (rows - 1)) / rows;

        const questionStyle = new TextStyle({
          fontSize: 24,
          fill: 0x1f2937,
          fontWeight: 'bold',
        });

        const questionText_ = new Text({
          text: questionText,
          style: questionStyle,
        });
        questionTextRef.current = questionText_;

        const questionBg = new Graphics();
        questionBg.rect(padding, padding, app.screen.width - padding * 2, 60);
        questionBg.fill(0xffffff);
        app.stage.addChild(questionBg);

        questionText_.x = app.screen.width / 2 - questionText_.width / 2;
        questionText_.y = padding + 15;
        app.stage.addChild(questionText_);

        const textStyle = new TextStyle({
          fontSize: 18,
          fill: 0x1f2937,
          fontWeight: 'bold',
          wordWrap: true,
          wordWrapWidth: boxWidth - 20,
          align: 'center',
        });

        const startY = 120;
        boxesRef.current = [];

        for (let i = 0; i < numOptions; i++) {
          const row = Math.floor(i / cols);
          const col = i % cols;

          const x = padding + col * (boxWidth + gap);
          const y = startY + row * (boxHeight + gap);

          const box = new Graphics();
          box.rect(0, 0, boxWidth, boxHeight);
          box.fill(0xffffff);
          box.stroke({ color: 0x999999, width: 2 });
          box.x = x;
          box.y = y;
          app.stage.addChild(box);

          const text = new Text({
            text: options[i]?.text || `Option ${i + 1}`,
            style: textStyle,
          });

          text.x = x + boxWidth / 2 - text.width / 2;
          text.y = y + boxHeight / 2 - text.height / 2;
          app.stage.addChild(text);

          boxesRef.current.push({ box, text });
        }

        startTimeRef.current = performance.now();
        isInitialized = true;

        const animate = () => {
          if (!appRef.current || !isInitialized) return;

          const currentTime = performance.now();
          const elapsed = (currentTime - startTimeRef.current) / 1000;

          if (isPlaying) {
            options.forEach((option, i) => {
              const cycle = elapsed * option.frequency;
              const isVisible = Math.floor(cycle) % 2 === 0;

              const entry = boxesRef.current[i];
              if (entry) {
                entry.box.tint = isVisible ? 0xffffff : 0x1f2937;
                entry.text.style.fill = isVisible ? 0x1f2937 : 0xffffff;
              }
            });
          } else {
            boxesRef.current.forEach((entry) => {
              entry.box.tint = 0xffffff;
              entry.text.style.fill = 0x1f2937;
            });
          }

          app.renderer.render(app.stage);
          animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Failed to initialize Pixi:', error);
      }
    };

    initializePixi();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [numOptions, options, isPlaying, questionText]);


  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-200"
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
