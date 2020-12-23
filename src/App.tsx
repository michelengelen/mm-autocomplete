import React, { useState } from 'react'
import './App.css'
import Autocomplete, { Option } from './autocomplete/autocomplete'

const suggestions: Record<string, Option[]> = {
    default: [
        {
            label: 'Messages from a user',
            value: 'from:',
        },
        {
            label: 'Messages in a channel',
            value: 'in:',
        },
        {
            label: 'Messages on a specific date',
            value: 'on:',
        },
        {
            label: 'Messages before a specific date',
            value: 'before:',
        },
        {
            label: 'Messages after a specific date',
            value: 'after:',
        },
        {
            label: 'Messages with a specific word/phrase',
            value: '""',
        },
        {
            label: 'Messages without a specific word/phrase',
            value: '-',
        },
    ],
    user: [
        {
            label: 'Michel Engelen',
            value: 'michel.engelen',
        },
        {
            label: 'John Doe',
            value: 'john.doe',
        },
        {
            label: 'Jane Austin-Doe',
            value: 'jane.austion-doe',
        },
    ],
    channel: [
        {
            label: 'Townhall',
            value: 'townhall',
        },
        {
            label: 'Public Space',
            value: 'public-space',
        },
    ],
}

function App() {
    const [value, setValue] = useState<string>('')
    const listRegex: Record<string, RegExp> = {
        user: /\bfrom:\s*(\S*)$/i,
        channel: /\bin:\s*(\S*)$/i,
        date: /\b(?:on|before|after):\s*(\S*)$/i,
    }

    const usedSuggestion =
        Object.keys(listRegex).find(key => {
            return listRegex[key].test(value)
        }) || 'default'

    const isDateSearch = usedSuggestion === 'date';

    return (
        <div className="App">
            <Autocomplete
                isDateSearch
                value={value}
                separator=":"
                options={!isDateSearch && usedSuggestion ? suggestions[usedSuggestion] : []}
                pageSize={4}
                onChange={(newValue: string): void => setValue(newValue)}
            />
        </div>
    )
}

export default App
