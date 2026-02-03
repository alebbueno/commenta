"use client";

import { useCallback, useRef, useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o changelog…",
  className,
  minHeight = "160px",
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>(value);

  const emitChange = useCallback(() => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    const normalized = html === "<br>" || html === "" ? "" : html;
    lastValueRef.current = normalized;
    onChange(normalized);
  }, [onChange]);

  useEffect(() => {
    if (!ref.current || value === lastValueRef.current) return;
    lastValueRef.current = value;
    ref.current.innerHTML = value || "";
  }, [value]);

  const exec = useCallback(
    (cmd: string, value?: string) => {
      document.execCommand(cmd, false, value);
      ref.current?.focus();
      emitChange();
    },
    [emitChange]
  );

  const addLink = useCallback(() => {
    const url = window.prompt("URL do link:");
    if (url) exec("createLink", url);
  }, [exec]);

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => exec("bold")}
          title="Negrito"
          aria-label="Negrito"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => exec("italic")}
          title="Itálico"
          aria-label="Itálico"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => exec("insertUnorderedList")}
          title="Lista com marcadores"
          aria-label="Lista"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => exec("insertOrderedList")}
          title="Lista numerada"
          aria-label="Lista numerada"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={addLink}
          title="Inserir link"
          aria-label="Inserir link"
        >
          <LinkIcon className="size-4" />
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        data-placeholder={placeholder}
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none min-w-0 px-3 py-2 text-sm text-foreground outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground focus:outline-none",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
        )}
        style={{ minHeight }}
        onInput={emitChange}
        onBlur={emitChange}
        suppressContentEditableWarning
      />
    </div>
  );
}
