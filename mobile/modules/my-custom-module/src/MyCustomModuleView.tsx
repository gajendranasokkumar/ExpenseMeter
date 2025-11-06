import { requireNativeView } from 'expo';
import * as React from 'react';

import { MyCustomModuleViewProps } from './MyCustomModule.types';

const NativeView: React.ComponentType<MyCustomModuleViewProps> =
  requireNativeView('MyCustomModule');

export default function MyCustomModuleView(props: MyCustomModuleViewProps) {
  return <NativeView {...props} />;
}
