import { useEffect, useMemo, useState } from 'react'
import {
  Inbox,
  MailOpen,
  Mail,
  Archive,
  ArchiveRestore,
  Trash2,
  Phone,
  MessageCircle,
} from 'lucide-react'
import {
  getMessages,
  marquerLu,
  archiverMessage,
  supprimerMessage,
} from '../../services/messagesService'
import { formatDate, formatPrix, whatsappLink } from '../../utils/helpers'
import { typeLabel } from '../../utils/constants'
import Badge from '../../components/Badge'

const ONGLETS = [
  { value: 'boite', label: 'Boîte de réception' },
  { value: 'archive', label: 'Archivés' },
]

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('boite')

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visibles = useMemo(
    () =>
      messages.filter((m) =>
        onglet === 'archive' ? m.archive : !m.archive
      ),
    [messages, onglet]
  )
  const nonLus = messages.filter((m) => !m.lu && !m.archive).length

  function maj(id, patch) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  async function toggleLu(m) {
    const lu = !m.lu
    maj(m.id, { lu })
    await marquerLu(m.id, lu)
  }
  async function toggleArchive(m) {
    const archive = !m.archive
    maj(m.id, { archive })
    await archiverMessage(m.id, archive)
  }
  async function supprimer(m) {
    if (!window.confirm('Supprimer ce message ?')) return
    setMessages((prev) => prev.filter((x) => x.id !== m.id))
    await supprimerMessage(m.id)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-950">Messages propriétaires</h1>
        <p className="text-gray-500">
          Demandes reçues depuis la page « Publier une annonce »
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-4 flex gap-2">
        {ONGLETS.map((o) => (
          <button
            key={o.value}
            onClick={() => setOnglet(o.value)}
            className={
              onglet === o.value
                ? 'btn-primary !py-2'
                : 'btn-outline !py-2'
            }
          >
            {o.label}
            {o.value === 'boite' && nonLus > 0 && (
              <span className="ml-1 rounded-full bg-secondary px-1.5 text-xs text-white">
                {nonLus}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-10 text-center text-gray-400">Chargement…</div>
      ) : visibles.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center text-gray-400">
          <Inbox size={40} className="text-gray-300" />
          <p className="mt-2">Aucun message ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibles.map((m) => (
            <article
              key={m.id}
              className={`card p-5 ${!m.lu && !m.archive ? 'border-l-4 border-l-secondary' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary-950">{m.nom}</h3>
                    {!m.lu && !m.archive && <Badge variant="new">Non lu</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Reçu le {formatDate(m.dateReception)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="primary">{typeLabel(m.typeBien)}</Badge>
                  <Badge variant="gray">{m.ville}</Badge>
                  {m.prix ? <Badge variant="secondary">{formatPrix(m.prix)}</Badge> : null}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
                {m.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-primary-100/70 pt-3">
                <a href={`tel:${m.telephone}`} className="btn-outline !py-1.5 text-sm">
                  <Phone size={15} /> {m.telephone}
                </a>
                <a
                  href={whatsappLink(m.telephone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp !py-1.5 text-sm"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => toggleLu(m)}
                    className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
                    title={m.lu ? 'Marquer non lu' : 'Marquer lu'}
                  >
                    {m.lu ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <button
                    onClick={() => toggleArchive(m)}
                    className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
                    title={m.archive ? 'Désarchiver' : 'Archiver'}
                  >
                    {m.archive ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  </button>
                  <button
                    onClick={() => supprimer(m)}
                    className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
