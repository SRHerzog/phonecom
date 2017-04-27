import React from 'react';
import {browserHistory} from 'react-router';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import ListItem from 'react-md/lib/Lists/ListItem';

import functionList from '../../functionList';

// function getItemClass(item, active) {
//     if (item.mobileDisplay) {
//         if (active) {
//             return styles.panelItemSelected;
//         }
//         return styles.panelItem;
//     } else {
//         if (active) {
//             return styles.desktopItemSelected;
//         }
//         return styles.desktopItem;
//     }
// }

const NavContainer = props => (
    <NavigationDrawer
        navItems={functionList.map(item =>
            <ListItem
                onClick={() => browserHistory.push(item.link)}
                primaryText={item.name}
            />
        )}
        drawerType={NavigationDrawer.DrawerTypes.CLIPPED}
    />
);

export default NavContainer;
