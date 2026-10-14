import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { content } from '../../../application/content/contentService'
import { pixPayload } from '../../../infrastructure/payments/pixPayload'
import { useCopy } from '../../hooks/useCopy'
import { Button, Icon } from '../atoms'
import { CopyRow } from '../molecules'
import s from './DonationPanel.module.css'

const { DOACAO, ORGANIZACAO } = content

/** Organismo: dados para doação (PIX quando configurado + conta bancária). */
export function DonationPanel() {
  const [qr, setQr] = useState('')
  const [copied, copy] = useCopy()
  const payload = DOACAO.pixChave
    ? pixPayload({ chave: DOACAO.pixChave, nome: DOACAO.pixNome, cidade: DOACAO.pixCidade })
    : ''

  useEffect(() => {
    if (payload) QRCode.toDataURL(payload, { margin: 1, width: 360, color: { dark: '#1b4a26', light: '#ffffff' } }).then(setQr)
  }, [payload])

  return (
    <div className={s.panel}>
      <div className={s.head}>
        <span className={s.icon}><Icon name="heart" size={24} /></span>
        <div>
          <h3 className={s.title}>Contribuição financeira</h3>
          <p className={s.text}>Faça um depósito para ajudar nas despesas mensais dos projetos.</p>
        </div>
      </div>
      {payload && (
        <div className={s.pix}>
          {qr && <img src={qr} alt="QR Code para doação via PIX" width="160" height="160" />}
          <Button onClick={() => copy(payload)} block icon={<Icon name={copied ? 'check' : 'copy'} size={18} />}>
            {copied ? 'Código copiado' : 'Copiar código PIX'}
          </Button>
        </div>
      )}
      <dl className={s.data}>
        <CopyRow label="Favorecido" value={DOACAO.favorecido} />
        <CopyRow label="CNPJ" value={ORGANIZACAO.cnpj} copyValue={ORGANIZACAO.cnpj.replace(/\D/g, '')} />
        <CopyRow label="Banco" value={DOACAO.banco} />
        <CopyRow label="Agência" value={DOACAO.agencia} copyValue={DOACAO.agencia} />
        <CopyRow label="Conta corrente" value={DOACAO.conta} copyValue={DOACAO.conta} />
      </dl>
    </div>
  )
}
