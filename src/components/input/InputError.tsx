import { FC, ReactNode, useEffect } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';
import 'tippy.js/themes/light.css';

interface InputErrorProps {
    id: string;
    children: ReactNode;
    message: string | null | undefined;
}

export const InputError: FC<InputErrorProps> = ({ id, children, message }) => {

    const removeTooltip = () => {
        const idSelector = '#' + id;
        const old = document.querySelector(idSelector);
        if ((old as any)?._tippy) {
            (old as any)._tippy.destroy();
        }
    };

    const showTooltip = () => {
        const idSelector = `#${id}-input-error-anchor`;

        removeTooltip();

        const content = document
            .getElementById(`${id}-input-error`)
            ?.cloneNode(true) as HTMLElement;

        if (content === null) {
            return;
        }

        content.setAttribute('id', `${id}-input-error-tooltip`);

        content?.classList.remove(`hidden`);

        tippy(idSelector, {
            showOnCreate: true,
            content: content,
            placement: 'bottom-start',
            theme: 'light',
            hideOnClick: 'toggle',
            trigger: 'click',
            allowHTML: true,
            onHidden(instance: { destroy: () => void; }) {
                instance.destroy();
            }
        });
    };

    useEffect(() => {
        if (message) {
            showTooltip();
        } else {
            removeTooltip();
        }

        return () => {
            const elements = document.querySelectorAll('[data-tippy-root]');
            elements.forEach((element) => {
                element.remove();
            });
        };
    }, [message]);

    return (
        <div>
            <div
                className={`text-red-500 hidden`}
                id={`${id}-input-error`}
            >
                <div>{message}</div>
            </div>
            <div
                id={`${id}-input-error-anchor`}
            >
                {children}
            </div>
        </div>
    );
};