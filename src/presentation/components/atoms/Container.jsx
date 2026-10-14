import s from './Container.module.css'

export function Container({ as: Tag = 'div', size = 'default', className = '', children, ...rest }) {
  return <Tag className={[s.container, s[size], className].join(' ')} {...rest}>{children}</Tag>
}
