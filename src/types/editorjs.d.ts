declare module '@editorjs/link' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs';
  
  export interface LinkData extends BlockToolData {
    link: string;
    meta: {
      title: string;
      description: string;
      image: {
        url: string;
      };
    };
  }

  export default class Link implements BlockTool {
    constructor({ data, config, api, readOnly }: any);
    static get toolbox(): { title: string; icon: string };
    render(): HTMLElement;
    save(blockContent: HTMLElement): LinkData;
    validate(savedData: LinkData): boolean;
  }
}

declare module '@editorjs/embed' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs';
  
  export interface EmbedData extends BlockToolData {
    service: string;
    source: string;
    embed: string;
    width: number;
    height: number;
    caption: string;
  }

  export default class Embed implements BlockTool {
    constructor({ data, config, api, readOnly }: any);
    static get toolbox(): { title: string; icon: string };
    render(): HTMLElement;
    save(blockContent: HTMLElement): EmbedData;
    validate(savedData: EmbedData): boolean;
  }
} 

declare module '@editorjs/simple-image' {
	import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

	const SimpleImage: ToolConstructable | ToolSettings;
	export default SimpleImage;
}

declare module '@editorjs/checklist' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Checklist: ToolConstructable | undefined;
    export default Checklist;
}

declare module '@editorjs/warning' {
    import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

    const Warning: ToolConstructable | ToolSettings;
    export default Warning;
}

declare module '@editorjs/marker' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Marker: ToolConstructable | undefined;
    export default Marker;
}

declare module '@editorjs/code' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Code: ToolConstructable | undefined;
    export default Code;
}

declare module '@editorjs/header' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Header: ToolConstructable | undefined;
    export default Header;
}

declare module '@editorjs/list' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const List: ToolConstructable | undefined;
    export default List;
}

declare module '@editorjs/table' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Table: ToolConstructable | undefined;
    export default Table;
}

declare module '@editorjs/quote' {
    import { ToolConstructable } from '@editorjs/editorjs';

    const Quote: ToolConstructable | undefined;
    export default Quote;
}

declare module '@editorjs/paragraph' {
  import { ToolConstructable } from '@editorjs/editorjs';

  const Paragraph: ToolConstructable | undefined;
  export default Paragraph;
}