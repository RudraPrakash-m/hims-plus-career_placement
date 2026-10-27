import React, { forwardRef } from "react";
import { inputBase, inputNormal, inputError, inputDisabled } from "../inputStyles";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
    label?: string;
    error?: string;
    helpText?: string;
    /** Visible lines when empty (the starting height). Defaults to 3. */
    rows?: number | string;
    /** Grow with the content as the user types (default true). */
    autoResize?: boolean;
    showCount?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            error,
            helpText,
            rows = 3,
            autoResize = true,
            showCount = false,
            maxLength,
            className = "",
            wrapperClassName = "",
            labelClassName = "",
            errorClassName = "",
            disabled,
            required,
            value,
            id,
            style,
            onInput,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${props.name || "field"}`;
        const localRef = React.useRef<HTMLTextAreaElement | null>(null);

        // Normalize rows to a positive integer (default 3)
        const parsedRows = typeof rows === "string" ? parseInt(rows, 10) : rows;
        const effectiveRows = !parsedRows || isNaN(parsedRows) || parsedRows < 1 ? 3 : parsedRows;

        // Base minimum height based on effective rows:
        // line-height is 1.375rem (22px), padding top+bottom is 0.875rem (14px), borders 2px
        const minHeightStyle = `calc(${effectiveRows} * 1.375rem + 0.875rem + 2px)`;

        const [charCount, setCharCount] = React.useState<number>(() => {
            if (typeof value === "string") return value.length;
            if (typeof props.defaultValue === "string") return props.defaultValue.length;
            return 0;
        });

        React.useEffect(() => {
            if (typeof value === "string") {
                setCharCount(value.length);
            }
        }, [value]);

        /** Never shorter than `rows` lines; taller when the text needs it. */
        const fitContent = React.useCallback(() => {
            const textarea = localRef.current;
            if (!textarea || !autoResize) return;
            textarea.style.height = "auto"; // reset so clientHeight reflects base rows
            const border = textarea.offsetHeight - textarea.clientHeight;
            if (textarea.scrollHeight > textarea.clientHeight) {
                textarea.style.height = `${textarea.scrollHeight + border}px`;
            }
        }, [autoResize]);

        // Controlled value, a changed `rows`, or the first render (react-hook-form fills the field without a value prop).
        React.useEffect(() => {
            fitContent();
        }, [value, effectiveRows, fitContent]);

        return (
            <div className={wrapperClassName}>
                {label && (
                    <label htmlFor={textareaId} className={`ui-label ${labelClassName}`}>
                        {label}{required && <span className="ui-required" aria-hidden>*</span>}
                    </label>
                )}
                {showCount && maxLength !== undefined && (
                    <div className="flex justify-end mb-1">
                        <span className={`ui-counter ${charCount > maxLength ? "ui-counter--over" : ""}`}>{charCount}/{maxLength}</span>
                    </div>
                )}
                <textarea
                    ref={(node) => {
                        localRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
                    }}
                    id={textareaId}
                    rows={effectiveRows}
                    disabled={disabled}
                    maxLength={maxLength}
                    style={{
                        minHeight: minHeightStyle,
                        ...style,
                    }}
                    className={[inputBase, error ? inputError : inputNormal, disabled ? inputDisabled : "", "resize-y", className].join(" ")}
                    value={value}
                    onInput={(e) => {
                        setCharCount(e.currentTarget.value.length);
                        fitContent();
                        onInput?.(e);
                    }}
                    {...props}
                />
                {helpText && !error && <p className="ui-help">{helpText}</p>}
                {error && <p className={`ui-error ${errorClassName}`} role="alert">{error}</p>}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";
export default TextArea;
