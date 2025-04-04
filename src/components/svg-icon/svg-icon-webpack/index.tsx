import React, {FC} from 'react';
import cx from 'classnames';
import './style.scss';


const importAll = (requireContext: __WebpackModuleApi.RequireContext) => {
    requireContext.keys().forEach(requireContext);
};
try {
    importAll(require.context('./svg', true, /\.svg$/));
} catch (error) {
    console.warn(error);
}

interface ISvgIconProps {
    name: string;
    className?: string;
    onClick?: () => void;
    size?: number;
    color?: string;
}

const SvgIcon: FC<ISvgIconProps> = (props) => {
    const {className, name, size = 20, color, onClick, ...othersProps} = props;

    const handleClick = () => {
        onClick && onClick();
    };

    const style = {
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
    };

    color && Object.assign(style, {color});

    return (
        <span
            className={cx('svg-icon-wrapper', className)}
            onClick={handleClick}
            style={style}
            {...othersProps}
        >
            <svg
                className={'svg-icon'}
                aria-hidden="true"
            >
                <use xlinkHref={`#icon-${name}`} />
            </svg>
        </span>
    );
};

export default SvgIcon;
