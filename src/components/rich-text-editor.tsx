"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading,
  Type,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

type BlockTag = "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "pre";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Digite o changelog…",
  className,
  minHeight = "160px",
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastValueRef = useRef<string>(value);
  const [viewMode, setViewMode] = useState<"visual" | "html">("visual");

  const emitChange = useCallback(
    (html: string) => {
      const normalized = html === "<br>" || html === "" ? "" : html;
      lastValueRef.current = normalized;
      onChange(normalized);
    },
    [onChange]
  );

  const emitFromEditable = useCallback(() => {
    if (!ref.current) return;
    emitChange(ref.current.innerHTML);
  }, [emitChange]);

  useEffect(() => {
    if (viewMode !== "visual" || !ref.current || value === lastValueRef.current) return;
    lastValueRef.current = value;
    ref.current.innerHTML = value || "";
  }, [value, viewMode]);

  const exec = useCallback(
    (cmd: string, value?: string) => {
      document.execCommand(cmd, false, value);
      ref.current?.focus();
      emitFromEditable();
    },
    [emitFromEditable]
  );

  const formatBlock = useCallback(
    (tag: BlockTag) => {
      document.execCommand("formatBlock", false, tag);
      ref.current?.focus();
      emitFromEditable();
    },
    [emitFromEditable]
  );

  const addLink = useCallback(() => {
    const url = window.prompt("URL do link:");
    if (url) exec("createLink", url);
  }, [exec]);

  const switchToHtml = useCallback(() => {
    const html = ref.current?.innerHTML ?? value;
    const normalized = html === "<br>" || html === "" ? "" : html;
    lastValueRef.current = normalized;
    setViewMode("html");
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [value]);

  const switchToVisual = useCallback(() => {
    const raw = textareaRef.current?.value ?? value;
    lastValueRef.current = raw.trim();
    onChange(raw.trim());
    setViewMode("visual");
    setTimeout(() => ref.current?.focus(), 0);
  }, [value, onChange]);

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1">
        <span className="mr-1 border-r border-border pr-2 text-xs font-medium text-muted-foreground">
          Bloco
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("h1")}
          title="Título 1"
          aria-label="H1"
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("h2")}
          title="Título 2"
          aria-label="H2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("h3")}
          title="Título 3"
          aria-label="H3"
        >
          <Heading3 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("h4")}
          title="Título 4"
          aria-label="H4"
        >
          <Heading className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("p")}
          title="Parágrafo"
          aria-label="Parágrafo"
        >
          <Type className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("blockquote")}
          title="Citação"
          aria-label="Citação"
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          onClick={() => formatBlock("pre")}
          title="Pré-formatado / código"
          aria-label="Pré-formatado"
        >
          <Code className="size-4" />
        </Button>

        <span className="mx-1 border-r border-border text-muted-foreground" aria-hidden />

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

        <span className="ml-auto border-l border-border pl-2" />
        <Button
          type="button"
          variant={viewMode === "html" ? "secondary" : "ghost"}
          size="sm"
          className="rounded-lg text-xs"
          onClick={viewMode === "visual" ? switchToHtml : switchToVisual}
          title={viewMode === "visual" ? "Ver/editar HTML" : "Voltar ao visual"}
        >
          <Code className="mr-1.5 size-3.5" />
          {viewMode === "visual" ? "Ver HTML" : "Visual"}
        </Button>
      </div>

      {viewMode === "visual" ? (
        <div
          ref={ref}
          contentEditable
          data-placeholder={placeholder}
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none min-w-0 px-3 py-2 text-sm text-foreground outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground focus:outline-none",
            "[&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_h4]:text-sm [&_h4]:font-semibold",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5",
            "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
            "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
            "[&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:overflow-x-auto"
          )}
          style={{ minHeight }}
          onInput={emitFromEditable}
          onBlur={emitFromEditable}
          suppressContentEditableWarning
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            lastValueRef.current = e.target.value;
            onChange(e.target.value);
          }}
          placeholder="<p>Conteúdo HTML…</p>"
          className="w-full min-w-0 resize-y border-0 bg-background px-3 py-2 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground focus:outline-none"
          style={{ minHeight }}
          spellCheck={false}
        />
      )}
    </div>
  );
}
