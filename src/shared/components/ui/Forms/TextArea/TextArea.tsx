import React, { forwardRef } from "react";
import { inputBase, inputNormal, inputError, inputDisabled } from "../inputStyles";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helpText?: string;
    /** Visible lines when empty (the starting height). */
    rows?: number;
    /** Grow with the content as the user types (default true). */
    autoResize?: boolean;
    showCount?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, helpText, rows = 1, autoResize = true, showCount = false, maxLength, className = "", wrapperClassName = "", labelClassName = "", errorClassName = "", disabled, required, value, id, onInput, ...props }, ref) => {
        const textareaId = id || `textarea-${props.name || "field"}`;
        const currentLength = typeof value === "string" ? value.length : 0;
        const localRef = React.useRef<HTMLTextAreaElement | null>(null);

        /** Never shorter than `rows` lines; taller when the text needs it. */
        const fitContent = React.useCallback(() => {
            const textarea = localRef.current;
            if (!textarea || !autoResize) return;
            textarea.style.height = "auto"; // back to the height `rows` gives
            const border = textarea.offsetHeight - textarea.clientHeight;
            textarea.style.height = `${textarea.scrollHeight + border}px`;
        }, [autoResize]);

        // Controlled value, a changed `rows`, or the first render (react-hook-form fills the field without a value prop).
        React.useEffect(() => {
            fitContent();
        }, [value, rows, fitContent]);

        return (
            <div className={wrapperClassName}>
                {label && (
                    <label htmlFor={textareaId} className={`ui-label ${labelClassName}`}>
                        {label}{required && <span className="ui-required" aria-hidden>*</span>}
                    </label>
                )}
                {showCount && maxLength !== undefined && (
                    <div className="flex justify-end mb-1">
                        <span className={`ui-counter ${currentLength > maxLength ? "ui-counter--over" : ""}`}>{currentLength}/{maxLength}</span>
                    </div>
                )}
                <textarea
                    ref={(node) => {
                        localRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
                    }}
                    id={textareaId}
                    rows={rows}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={[inputBase, error ? inputError : inputNormal, disabled ? inputDisabled : "", "resize-y", className].join(" ")}
                    value={value}
                    onInput={(e) => {
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
