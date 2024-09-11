import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import {
    Navbar,
    NavbarNavigationBar,
    NavbarAdditionalItems,
    NavbarUserMenu,
    NavbarHelpLink,
    ApplicationSwitcher,
    NavbarBody,
    NavbarIconAction,
} from '@lwt-helix/navbar';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from '../../../store/store';
import { getEndpoint, LWA_PLATFORM } from '../../../providers/endpoint.provider';
import { tokenTypes } from '../../../constants/auth';
import { navTerms } from '../../../constants';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { chevron_left } from '@lwt-helix/helix-icon/outlined';
import { routesToShowBackNavBar } from '../../../constants/nav';
import { backButtonByRoute } from '../../helpers/routes';
import { useAuthStore } from '../../../store/auth/store';
import { labelsByApp } from '../../../constants/appLabels';
import { runningApp } from '../../../constants/app';

const UniversalNavBar = props => {
    const history = useHistory();
    const { navItems, userItems, helpItems } = props;

    const {
        isLoading,
        isLoadingSearchData,
        resetStore
    } = useSearchStore(state => ({
        isLoading: state.isLoading,
        isLoadingSearchData: state.isLoadingSearchData,
        resetStore: state.resetStore,
    }));

    const {
        backNavbarTitle,
    } = useCommonStore(state => ({
        backNavbarTitle: state.backNavbar.title,
    }));

    const { resetSavedAgentsStore } = useSavedAgentsStore (
        state => ({
        resetSavedAgentsStore: state.resetStore})
    );

    const [navbarItems, setNavbarItems] = useState();

    const {
        appSections,
        tokenType,
    } = useAuthStore(state => ({
        appSections: state.appSections,
        tokenType: state.tokenType,
    }));

    const isLWAAuthenticated = tokenType === tokenTypes.LWA;

    useEffect(() => {
        setNavbarItems(navItems);
    }, [navItems]);

    useEffect(() => {
        navbarItems && setNavbarItems(prevNavItems => {
            if (prevNavItems?.length) {
                prevNavItems.forEach(prevItem => {
                    if (prevItem?.menuItems) {
                        prevItem.menuItems = prevItem.menuItems.map(item => {
                            return item.header ? item : { ...item, disabled: isLoading || isLoadingSearchData };
                        });
                    }
                    return { ...prevItem, disabled: isLoading || isLoadingSearchData };
                });
                return prevNavItems;
            }
        });
    }, [isLoading, isLoadingSearchData]);

    const handleLogoClick = () => {
        resetStore();
        resetSavedAgentsStore();
    };

    const logoLinkWrapper = ({ url, logo }) => <Link onClick={handleLogoClick} to={url}>{logo}</Link>;

    const navBar = <>
        <Navbar
            dataLwtId='xbmNav'
            applicationName={labelsByApp[runningApp].headerLabel}
            location={location}
            logoLinkWrapper={logoLinkWrapper}
            logoUrl={!isLoadingSearchData ? '/' : ''}
        >
            {navbarItems && <NavbarNavigationBar
                location={{ pathname: window.location.pathname }}
                navItems={navbarItems}
            />
            }
            <NavbarAdditionalItems className='navbar-additonal-items'>
                <NavbarHelpLink menuItems={helpItems} hideHelpHeader='true' />
                <NavbarUserMenu menuItems={userItems} />
            </NavbarAdditionalItems>
        </Navbar>
    </>;

    const appSwitcherNavBar = <>
        <Navbar
            dataLwtId='xbmNav'
            location={location}
            logoLinkWrapper={logoLinkWrapper}
            logoUrl={!isLoadingSearchData ? '/' : ''}
        >
            <ApplicationSwitcher
                appSections={appSections}
                applicationName={labelsByApp[runningApp].headerLabel}
                launchpadUrl={getEndpoint(LWA_PLATFORM)}
            />

            {navbarItems && <NavbarNavigationBar
                location={{ pathname: window.location.pathname }}
                navItems={navbarItems}
            />
            }
            <NavbarAdditionalItems className='navbar-additonal-items'>
                <NavbarHelpLink menuItems={helpItems} hideHelpHeader='true' />
                <NavbarUserMenu menuItems={userItems} />
            </NavbarAdditionalItems>
        </Navbar>
    </>

    const BackNavBar = () => (
        <Navbar
            dataLwtId='xbmNav'
            location={location}
            hideLogo
        >
            <NavbarBody>
                <NavbarIconAction
                    onClick={() => backButtonByRoute[window.location.pathname](history)}
                    icon={
                        <HelixIcon
                            className='header-back-button'
                            icon={chevron_left}
                        />
                    }>
                    Market Dynamics
                </NavbarIconAction>
            </NavbarBody>
            <NavbarBody>
                <span className='helix-body--strong'>
                    {backNavbarTitle}
                </span>
            </NavbarBody>
        </Navbar>
    );

    if (routesToShowBackNavBar.includes(window.location.pathname)) return <BackNavBar />;

    if (isLWAAuthenticated) return appSwitcherNavBar;

    return navBar;
};

UniversalNavBar.propTypes = {
    navItems: PropTypes.array,
    userItems: PropTypes.array,
    helpItems: PropTypes.array,
};

export default UniversalNavBar;
