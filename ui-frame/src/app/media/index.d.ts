declare interface MediaRecorderErrorEvent extends Event {
  name: string;
}

declare interface MediaRecorderDataAvailableEvent extends Event {
  data: any;
}

interface MediaRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  bitsPerSecond?: number;
}


interface MediaRecorderEventMap {
  'dataavailable': MediaRecorderDataAvailableEvent;
  'error': MediaRecorderErrorEvent;
  'pause': Event;
  'resume': Event;
  'start': Event;
  'stop': Event;
  'warning': MediaRecorderErrorEvent;
}

declare class MediaRecorder extends EventTarget {
  readonly stream: MediaStream;
  readonly mimeType: string;
  readonly state: 'inactive' | 'recording' | 'paused';
  readonly videoBitsPerSecond: number;
  readonly audioBitsPerSecond: number;

  ondataavailable: (event: MediaRecorderDataAvailableEvent) => void;
  onerror: ((event: MediaRecorderErrorEvent) => void) | null;
  onpause: EventListener | null;
  onresume: EventListener | null;
  onstart: EventListener | null;
  onstop: EventListener | null;

  constructor(stream: MediaStream, options?: MediaRecorderOptions);

  addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any,
                                                          options?: boolean | AddEventListenerOptions): void;

  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any,
                                                             options?: boolean | EventListenerOptions): void;

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

  start(timeslice?: number): void;

  stop(): void;

  resume(): void;

  pause(): void;

  requestData(): void;

  isTypeSupported(type: string): boolean;
}
