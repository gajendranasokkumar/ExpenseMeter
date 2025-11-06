import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './MyCustomModule.types';

type MyCustomModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class MyCustomModule extends NativeModule<MyCustomModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(MyCustomModule, 'MyCustomModule');
