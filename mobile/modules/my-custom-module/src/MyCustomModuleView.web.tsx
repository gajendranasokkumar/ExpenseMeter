import * as React from 'react';

import { MyCustomModuleViewProps } from './MyCustomModule.types';

export default function MyCustomModuleView(props: MyCustomModuleViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
