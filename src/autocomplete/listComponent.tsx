import React from 'react'

export interface Props {
    label: string
    description?: string
    isHighlighted: boolean
    iconComponent: React.ReactNode
    onClick: () => void
}

const ListComponent: React.FC<Props> = (props: Props) => {

    const styles = {
        wrapper: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            margin: 0,
            padding: 12,
            backgroundColor: props.isHighlighted ? 'rgb(233,233,233)' : 'rgb(255,255,255)',
        },
        icon: {
            display: 'flex',
            flex: '0 1 10%',
            justifyContent: 'flex-start',
            padding: 12,
        },
        content: {
            display: 'flex',
            flex: 4,
            justifyContent: 'flex-start',
            padding: 12,
        },
    }

    return (
        <div style={styles.wrapper} onClick={props.onClick}>
            <div style={styles.icon}>
                <span className="value">{props.iconComponent}</span>
            </div>
            <div style={styles.content}>
                <p>{props.label}</p>
                {props.description && <p>{props.description}</p>}
            </div>
        </div>
    )
}

export default ListComponent
