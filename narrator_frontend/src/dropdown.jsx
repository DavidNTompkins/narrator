import React, { useState } from 'react';
import presets from './presets/basePresets.json'

function DropdownButton(props) {
  const desktop = (window.innerWidth > 768)
  const [dropdownVisible, setDropdownVisible] = useState(desktop);
  
  function handleClick() {
    setDropdownVisible(!dropdownVisible);
  }

  function handleItemClick(item) {
    console.log("here")
    props.onItemClick(item);
    setDropdownVisible(false);
  }

  const menuItems = Object.keys(props.menuItems).map((category) => {
    const items = props.menuItems[category];

    const categoryItems = Object.keys(items).map((itemKey) => {
      const item = items[itemKey];

      return (
        <div key={itemKey} onClick={() => handleItemClick(props.menuItems[category][item])}>
          {props.menuItems[category][item]}
      
        </div>
      );
    });

    return (
      <div className="dropdown-items" key={category}>
        <div onClick={() => handleItemClick(props.menuItems[category])}>{category}</div>
        <div>{categoryItems}</div>
      </div>
    );
  });

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={handleClick}>{props.title}</button>
      {dropdownVisible && (
        <div className="dropdown-content">
          {menuItems}
        </div>
      )}
    </div>
  );
}
export default DropdownButton
/*
// Usage example
const menuItems = {
  Adventure: {
    schoolandsorcery: { name: "School and Sorcery" },
    butterbeard: { name: "Butter Beard" }
  },
  Space: {
    gambit: { name: "Gambit" },
    Aliens: { name: "Aliens" },
    HoloDeck: { name: "HoloDeck" }
  }
};

function handleItemClick(item) {
  console.log(`Clicked item ${item.name}`);
  // Do something else here, like update state or make an API call
}

<DropdownButton title="Adventure" menuItems={menuItems.Adventure} onItemClick={handleItemClick} />
<DropdownButton title="Space" menuItems={menuItems.Space} onItemClick={handleItemClick} />
*/