import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, SmallButton, Icon, SearchInput, Checkbox, useContactGroups, useContacts } from 'react-components';
import { c } from 'ttag';
import { normalize } from 'proton-shared/lib/helpers/string';
import { toMap } from 'proton-shared/lib/helpers/object';

const UNCHECKED = 0;
const CHECKED = 1;
const INDETERMINATE = 2;

const getModel = (contactGroups = [], contacts = []) => {
    if (!contacts.length || !contactGroups.length) {
        return Object.create(null);
    }

    return contactGroups.reduce((acc, { ID }) => {
        const inGroup = contacts.filter(({ LabelIDs = [] }) => {
            return LabelIDs.includes(ID);
        });
        acc[ID] = inGroup.length ? (contacts.length === inGroup.length ? CHECKED : INDETERMINATE) : UNCHECKED;
        return acc;
    }, Object.create(null));
};

const ContactGroupDropdown = ({ className, contactIDs }) => {
    const [keyword, setKeyword] = useState('');
    const normalizedKeyword = normalize(keyword);
    const [contactGroups] = useContactGroups();
    const [contacts] = useContacts();
    const mapContacts = toMap(contacts);
    const [model, setModel] = useState(getModel(contactGroups, contactIDs.map((contactID) => mapContacts[contactID])));
    const groups = normalizedKeyword.length
        ? contactGroups.filter(({ Name }) => normalize(Name).includes(normalizedKeyword))
        : contactGroups;

    const handleCheck = (contactGroupID) => ({ target }) => {
        setModel({ ...model, [contactGroupID]: +target.checked });
    };

    const handleApply = () => {
        // TODO
        console.log(model);
    };

    const handleAdd = () => {
        console.log('TODO open modal');
    };

    return (
        <Dropdown caret className={className} content={c('Contact group dropdown').t`Group`} autoClose={false}>
            <div className="p1">
                <div className="flex flex-spacebetween mb1">
                    <strong>{c('Label').t`Add to group`}</strong>
                    <SmallButton className="pm-button--primary pm-button--for-icon" onClick={handleAdd}>
                        <Icon name="contacts-groups" fill="light" />+
                    </SmallButton>
                </div>
                <div className="mb1">
                    <SearchInput
                        value={keyword}
                        onChange={setKeyword}
                        autoFocus={true}
                        placeholder={c('Placeholder').t`Filter groups`}
                    />
                </div>
                <div className="mb1">
                    <ul className="unstyled m0">
                        {groups.map(({ ID, Name, Color }) => {
                            return (
                                <li
                                    key={ID}
                                    className="flex flex-spacebetween flex-nowrap border-bottom border-bottom--dashed pt0-5 pb0-5"
                                >
                                    <label htmlFor={ID} className="flex flex-nowrap">
                                        <Icon name="contacts-groups" className="mr0-5" color={Color} />
                                        <span className="ellipsis">{Name}</span>
                                    </label>
                                    <Checkbox
                                        id={ID}
                                        checked={model[ID] === CHECKED}
                                        indeterminate={model[ID] === INDETERMINATE}
                                        onChange={handleCheck(ID)}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="aligncenter">
                    <SmallButton className="pm-button--primary" onClick={handleApply}>{c('Action')
                        .t`Apply`}</SmallButton>
                </div>
            </div>
        </Dropdown>
    );
};

ContactGroupDropdown.propTypes = {
    className: PropTypes.string,
    contactIDs: PropTypes.arrayOf(PropTypes.string)
};

export default ContactGroupDropdown;
