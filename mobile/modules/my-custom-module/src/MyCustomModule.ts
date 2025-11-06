import { NativeModule, requireNativeModule } from 'expo';

import { MyCustomModuleEvents } from './MyCustomModule.types';

declare class MyCustomModule extends NativeModule<MyCustomModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MyCustomModule>('MyCustomModule');
