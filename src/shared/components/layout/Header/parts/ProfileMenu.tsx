import { KeyRound, LogOut, Palette, Settings } from "lucide-react";
import { useT } from "@/shared/i18n/I18nProvider";
import { onMenuArrowKeys, usePopover } from "./usePopover";

/* ---------------------------------------------------------------------- */
/* Avatar: initials on a tint picked from the name                        */
/* ---------------------------------------------------------------------- */

const AVATAR_TINTS = 6;
const hash = (s: string) => Array.from(s).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

export const Avatar = ({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) => (
    <span role="img" aria-label={name} className={`hdr-avatar hdr-avatar--${size} hdr-avatar--t${hash(name) % AVATAR_TINTS}`}>
        {initials(name)}
    </span>
);

/* ---------------------------------------------------------------------- */
/* Profile menu                                                           */
/* ---------------------------------------------------------------------- */

export interface ProfileUser {
    name: string;
    email: string;
    role: string;
}

export interface ProfileMenuProps {
    user: ProfileUser;
    onAccountSettings?: () => void;
    onChangePassword?: () => void;
    /** Opens the Theme settings panel. */
    onThemeSettings?: () => void;
    onLogout?: () => void;
}

export const ProfileMenu = ({ user, onAccountSettings, onChangePassword, onThemeSettings, onLogout }: ProfileMenuProps) => {
    const t = useT();
    const { open, setOpen, toggle, rootRef, triggerRef } = usePopover();

    const close = () => {
        setOpen(false);
        triggerRef.current?.focus();
    };
    const run = (action?: () => void) => {
        close();
        action?.();
    };

    return (
        <div className="relative" ref={rootRef}>
            <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={`Account menu for ${user.name}`}
                className="header-profile"
            >
                <span key={user.role} className="fx-pulse rounded-full">
                    <Avatar name={user.name} />
                </span>
                {/* Name only: the role is shown by the header role switcher. */}
                <span className="header-profile__name max-md:hidden">{user.name}</span>
            </button>

            {open && (
                <div className="header-menu w-72 p-0" onKeyDown={onMenuArrowKeys}>
                    <div className="hdr-profile__head">
                        <Avatar name={user.name} size="lg" />
                        <div className="min-w-0">
                            <p className="hdr-profile__name">{user.name}</p>
                            <p className="hdr-profile__email">{user.email}</p>
                            <span className="hdr-badge">{user.role}</span>
                        </div>
                    </div>

                    <div role="menu" aria-label="Account" className="hdr-menu-list">
                        <button type="button" role="menuitem" className="hdr-menu-item" onClick={() => run(onAccountSettings)}>
                            <span className="hdr-menu-item__icon"><Settings size={16} /></span>
                            {t("Account settings")}
                        </button>
                        <button type="button" role="menuitem" className="hdr-menu-item" onClick={() => run(onChangePassword)}>
                            <span className="hdr-menu-item__icon"><KeyRound size={16} /></span>
                            {t("Change password")}
                        </button>
                        {onThemeSettings && (
                            <button type="button" role="menuitem" className="hdr-menu-item" onClick={() => run(onThemeSettings)}>
                                <span className="hdr-menu-item__icon"><Palette size={16} /></span>
                                {t("Theme settings")}
                            </button>
                        )}
                        <div role="separator" className="hdr-menu-sep" />
                        <button type="button" role="menuitem" className="hdr-menu-item hdr-menu-item--danger" onClick={() => run(onLogout)}>
                            <span className="hdr-menu-item__icon"><LogOut size={16} /></span>
                            {t("Log out")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

