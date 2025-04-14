import { FC, ReactNode } from 'react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';
import 'tippy.js/themes/light.css';
import Tippy from "@tippyjs/react";

interface PopoverProps {
    id: string;
    info: string | ReactNode;
    children: ReactNode;
    placement?: string;
    active?: boolean;
}

export const Popover: FC<PopoverProps> = ({
                                              id,
                                              info,
                                              children,
                                              placement = 'top',
                                              active = true,
                                          }) => {

    return (
        <Tippy
            disabled={!active}
            animation="shift-away-subtle"
            placement={placement}
            theme="light"
            content={
                <div id={`${id}-popover`}>
                    {info}
                </div>
            }
        >
            <div id={`${id}-popover-anchor`} className={'w-fit'}>
                {children}
            </div>
        </Tippy>
    );
};