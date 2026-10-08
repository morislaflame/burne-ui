/**
 * Default kit glyphs (Ionicons 5 shapes). Production components must import
 * from here, not `react-icons`. Apps may still pass `react-icons` as `icon`.
 */
import {
  forwardRef,
  type ReactNode,
  type SVGProps,
} from "react";

export type KitIconProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  title?: string;
};

function createKitIcon(displayName: string, children: ReactNode) {
  const Icon = forwardRef<SVGSVGElement, KitIconProps>(function KitIcon(
    { className, size, title, width, height, children: _, "aria-hidden": ariaHidden, ...rest },
    ref) {
    const box = size ?? "1em";
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={width ?? box}
        height={height ?? box}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        className={className}
        aria-hidden={ariaHidden ?? (title ? undefined : true)}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

export const KitChevronDown = createKitIcon(
  "KitChevronDown",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="48"
    d="m112 184 144 144 144-144"
  />);

export const KitChevronUp = createKitIcon(
  "KitChevronUp",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="48"
    d="m112 328 144-144 144 144"
  />);

export const KitChevronForward = createKitIcon(
  "KitChevronForward",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="48"
    d="m184 112 144 144-144 144"
  />);

export const KitChevronBack = createKitIcon(
  "KitChevronBack",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="48"
    d="M328 112 184 256l144 144"
  />);

export const KitClose = createKitIcon(
  "KitClose",
  <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z" />);

export const KitAdd = createKitIcon(
  "KitAdd",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="32"
    d="M256 112v288M400 256H112"
  />);

export const KitRemove = createKitIcon(
  "KitRemove",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="32"
    d="M400 256H112"
  />);

export const KitSearch = createKitIcon(
  "KitSearch",
  <path d="M456.69 421.39 362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3zM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8 124.95 124.95 0 0 1-124.8-124.8z" />);

export const KitCheckmarkSharp = createKitIcon(
  "KitCheckmarkSharp",
  <path
    fill="none"
    strokeLinecap="square"
    strokeMiterlimit="10"
    strokeWidth="44"
    d="M416 128 192 384l-96-96"
  />);

export const KitArrowForward = createKitIcon(
  "KitArrowForward",
  <path
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="48"
    d="m268 112 144 144-144 144m124-144H100"
  />);

export const KitFolderOpen = createKitIcon(
  "KitFolderOpen",
  <path d="M408 96H252.11a23.89 23.89 0 0 1-13.31-4L211 73.41A55.77 55.77 0 0 0 179.89 64H104a56.06 56.06 0 0 0-56 56v24h416c0-30.88-25.12-48-56-48zm15.75 352H88.25a56 56 0 0 1-55.93-55.15L16.18 228.11v-.28A48 48 0 0 1 64 176h384.1a48 48 0 0 1 47.8 51.83v.28l-16.22 164.74A56 56 0 0 1 423.75 448zm56.15-221.45z" />);

export const KitEye = createKitIcon(
  "KitEye",
  <>
    <circle cx="256" cy="256" r="64" />
    <path d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72 38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76zM256 352a96 96 0 1 1 96-96 96.11 96.11 0 0 1-96 96z" />
  </>);

export const KitEyeOff = createKitIcon(
  "KitEyeOff",
  <>
    <path d="M432 448a15.92 15.92 0 0 1-11.31-4.69l-352-352a16 16 0 0 1 22.62-22.62l352 352A16 16 0 0 1 432 448zM248 315.85l-51.79-51.79a2 2 0 0 0-3.39 1.69 64.11 64.11 0 0 0 53.49 53.49 2 2 0 0 0 1.69-3.39zm16-119.7L315.87 248a2 2 0 0 0 3.4-1.69 64.13 64.13 0 0 0-53.55-53.55 2 2 0 0 0-1.72 3.39z" />
    <path d="M491 273.36a32.2 32.2 0 0 0-.1-34.76c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.68 96a226.54 226.54 0 0 0-71.82 11.79 4 4 0 0 0-1.56 6.63l47.24 47.24a4 4 0 0 0 3.82 1.05 96 96 0 0 1 116 116 4 4 0 0 0 1.05 3.81l67.95 68a4 4 0 0 0 5.4.24 343.81 343.81 0 0 0 67.24-77.4zM256 352a96 96 0 0 1-93.3-118.63 4 4 0 0 0-1.05-3.81l-66.84-66.87a4 4 0 0 0-5.41-.23c-24.39 20.81-47 46.13-67.67 75.72a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.39 76.14 98.28 100.65C162.06 402 207.92 416 255.68 416a238.22 238.22 0 0 0 72.64-11.55 4 4 0 0 0 1.61-6.64l-47.47-47.46a4 4 0 0 0-3.81-1.05A96 96 0 0 1 256 352z" />
  </>);

export const KitCheckmarkCircleOutline = createKitIcon(
  "KitCheckmarkCircleOutline",
  <>
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M352 176 217.6 336 160 272"
    />
  </>);

export const KitCloseCircleOutline = createKitIcon(
  "KitCloseCircleOutline",
  <>
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M320 320 192 192m0 128 128-128"
    />
  </>);

export const KitInformationCircleOutline = createKitIcon(
  "KitInformationCircleOutline",
  <>
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
      d="M220 220h32v116"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M208 340h88"
    />
    <path d="M248 130a26 26 0 1 0 26 26 26 26 0 0 0-26-26z" />
  </>);

export const KitWarning = createKitIcon(
  "KitWarning",
  <path d="M449.07 399.08 278.64 82.58c-12.08-22.44-44.26-22.44-56.35 0L51.87 399.08A32 32 0 0 0 80 446.25h340.89a32 32 0 0 0 28.18-47.17zm-198.6-1.83a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.95a21.73 21.73 0 0 1 21.5-22.69h.21a21.74 21.74 0 0 1 21.73 22.7z" />);

export const KitHelpCircleOutline = createKitIcon(
  "KitHelpCircleOutline",
  <>
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="32"
      d="M256 80a176 176 0 1 0 176 176A176 176 0 0 0 256 80z"
    />
    <path
      fill="none"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="28"
      d="M200 202.29s.84-17.5 19.57-32.57C230.68 160.77 244 158.18 256 158c10.93-.14 20.69 1.67 26.53 4.45 10 4.76 29.47 16.38 29.47 41.09 0 26-17 37.81-36.37 50.8S251 281.43 251 296"
    />
    <circle cx="250" cy="348" r="20" />
  </>);
