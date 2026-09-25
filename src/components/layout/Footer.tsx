/**
 * One row: the wordmark that opens the page in the navbar, and the copyright
 * line that closes it.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id='site-footer' className='site-footer'>
            <span className='site-footer__logo'>JK</span>
            <p className='site-footer__copyright'>&copy; {year} Jefry Kurniawan</p>
        </footer>
    );
}
