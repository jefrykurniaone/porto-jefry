/**
 * One row: the wordmark that opens the page in the navbar on one side, the
 * copyright line on the other.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer id='site-footer' className='site-footer'>
            <div className='site-footer__inner'>
                <span className='site-footer__logo'>JK</span>
                <p className='site-footer__copyright'>&copy; {year} Jefry Kurniawan</p>
            </div>
        </footer>
    );
}
