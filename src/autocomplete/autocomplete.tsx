import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import ListComponent from './listComponent'
import './styles.css'

export interface Option {
    value: string
    label: string
    description?: string
}

interface Props {
    value: string
    separator: string
    options: Option[]
    onChange: Function
    isDateSearch: boolean
    pageSize?: number
    children?: React.ReactNode
}

const Autocomplete: React.FC<Props> = ({ value, separator, options, onChange, pageSize = 5, ...props }: Props) => {
    const [filteredOptions, setFilteredOptions] = useState(options)
    const [showOptionsList, setShowOptionsList] = useState(false)
    const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)

    const isOptionsListEmpty = filteredOptions.length === 0;

    useEffect(() => {
        if (inputRef.current && value.endsWith('""')) {
            const input = inputRef.current
            input.setSelectionRange(input.value.length - 1, input.value.length - 1)
            input.focus()
        }
    }, [value])

    useEffect(() => {
        const termPairs = value.split(' ')
        const lastTermPair = termPairs[termPairs.length - 1]
        const currentTermParts = lastTermPair.split(separator)
        const currentTerm = currentTermParts[currentTermParts.length - 1]
        setFilteredOptions(
            options.filter(
                suggestion => suggestion.value !== currentTerm && suggestion.value?.indexOf(currentTerm) > -1
            )
        )
    }, [value, options, separator])

    const handleOptionSelect = (optionValue: string) => {
        const newValue = `${optionValue}${optionValue.endsWith(separator) || optionValue === '""' ? '' : ' '}`;

        const termPairs = value.split(' ')
        const lastTermPair = termPairs[termPairs.length - 1]
        if (!lastTermPair) {
            termPairs.push(newValue)
        } else {
            const lastTermParts = lastTermPair.split(separator)
            lastTermParts[lastTermParts.length - 1] = newValue
            termPairs[termPairs.length - 1] = lastTermParts.join(separator)
        }
        onChange(termPairs.join(' '))
        changeHighlightedIndex('reset')
        inputRef?.current?.focus()
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        onChange(value)
    }

    const changeHighlightedIndex = (delta: number | 'reset' | 'start' | 'end') => {
        if (!showOptionsList || isOptionsListEmpty) {
            return
        }

        const getNextIndex = () => {
            const maxIndex = filteredOptions.length - 1

            if (delta === 'reset') {
                return -1
            }

            if (delta === 'start') {
                return 0
            }

            if (delta === 'end') {fi
                return maxIndex
            }

            const newIndex = highlightedOptionIndex + delta

            if (newIndex < 0) {
                if (newIndex === -1) {
                    return -1
                }

                if (Math.abs(delta) > 1) {
                    return 0
                }

                return maxIndex
            }

            if (newIndex > maxIndex) {
                return Math.abs(delta) > 1 ? maxIndex : -1
            }

            return newIndex
        }

        setHighlightedOptionIndex(getNextIndex())
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!showOptionsList || isOptionsListEmpty) {
            return
        }

        switch (event.key) {
            case 'Home':
                // Prevent scroll of the page
                event.preventDefault()
                changeHighlightedIndex('start')
                break
            case 'End':
                // Prevent scroll of the page
                event.preventDefault()
                changeHighlightedIndex('end')
                break
            case 'PageUp':
                // Prevent scroll of the page
                event.preventDefault()
                changeHighlightedIndex(-pageSize)
                break
            case 'PageDown':
                // Prevent scroll of the page
                event.preventDefault()
                changeHighlightedIndex(pageSize)
                break
            case 'ArrowDown':
                // Prevent cursor move
                event.preventDefault()
                changeHighlightedIndex(1)
                break
            case 'ArrowUp':
                // Prevent cursor move
                event.preventDefault()
                changeHighlightedIndex(-1)
                break
            case 'Enter':
                if (highlightedOptionIndex !== -1 && showOptionsList && !isOptionsListEmpty) {
                    const option = filteredOptions[highlightedOptionIndex]

                    // We don't want to validate the form.
                    event.preventDefault()

                    // Move the selection to the end.
                    handleOptionSelect(option.value)
                }
                break
            default:
        }
    }

    return (
        <div className="wrapper">
            <input
                ref={inputRef}
                value={value || ''}
                onChange={handleChange}
                className="autocomplete"
                onKeyDown={handleKeyDown}
                onFocus={() => setShowOptionsList(true)}
                onBlur={() => setShowOptionsList(false)}
            />
            {filteredOptions.length > 0 ? (
                // @ts-ignore
                <div className="suggestionlist">
                    {filteredOptions.map((option, i) => (
                        <ListComponent
                            {...option}
                            key={option.value + i}
                            isHighlighted={i === highlightedOptionIndex}
                            iconComponent={option.value}
                            onClick={() => handleOptionSelect(option.value)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default Autocomplete
