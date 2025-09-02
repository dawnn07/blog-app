"use client";

import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { UndoToolbar } from "@/components/toolbars/undo";
import { Editor } from "@tiptap/react";


interface EditorToolbarProps {
	editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {

	return (
		<div className="border w-full px-3 overflow-auto relative rounded-md">
			<ToolbarProvider editor={editor}>
				<div className="flex w-full py-2 h-full [&>button]:shrink-0 items-center gap-2">
					<UndoToolbar />
					<RedoToolbar />
					<Separator orientation="vertical" className="h-7" />
					<BoldToolbar />
					<ItalicToolbar />
					<StrikeThroughToolbar />
					<BulletListToolbar />
					<OrderedListToolbar />
					<CodeToolbar />
					<CodeBlockToolbar />
					<HorizontalRuleToolbar />
					<BlockquoteToolbar />
					<HardBreakToolbar />
				</div>
			</ToolbarProvider>
		</div>
	);
};

export default EditorToolbar;
