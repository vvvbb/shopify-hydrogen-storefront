import React, {useState} from 'react';

/**
 * A collapsible component that toggles the visibility of its content.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title displayed on the collapsible button.
 * @param {string} props.description - The content shown when expanded.
 * @returns {JSX.Element} The rendered Collapse component.
 */
export function Collapse({title, description}) {

  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);
  const collapseClass = expanded ? 'c-collapse--open' : '';

  return (
    <div aria-labelledby="collapse" className={`c-collapse ${collapseClass}`}>
      <button type="button" onClick={toggle} className="collapsible">{title}</button>
      <div className="content">
        <div dangerouslySetInnerHTML={{__html: description}} />
      </div>
    </div>
  );
}
