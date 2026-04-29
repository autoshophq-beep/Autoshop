import { useState, useEffect } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://puzbmgnxjufkglnfuyau.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1emJtZ254anVma2dsbmZ1eWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDYyOTAsImV4cCI6MjA5Mjk4MjI5MH0.L1ekQgGQA2bOsgbh7vJqw85DhSZHPSWzDLq16LEB0Gs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABS = ["Creators", "Queue", "Products", "Affiliates", "Analytics"];

const statusColors = {
  pending: "#f59e0b",
  approved: "#10b981",
  posted: "#3b82f6",
  rejected: "#ef4444",
  active: "#10b981",
  inactive: "#6b7280",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #e8e8e8; font-family: 'DM Mono', monospace; min-height: 100vh; }
  .app { min-height: 100vh; background: #0a0a0a; background-image: radial-gradient(ellipse at 20% 0%, rgba(16,185,129,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(59,130,246,0.05) 0%, transparent 50%); }
  .header { border-bottom: 1px solid #1a1a1a; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(12px); z-index: 100; }
  .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #fff; display: flex; align-items: center; gap: 10px; }
  .logo-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 8px #10b981; } 50% { opacity: 0.6; box-shadow: 0 0 16px #10b981; } }
  .header-right { display: flex; align-items: center; gap: 16px; font-size: 11px; color: #444; }
  .status-pill { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); color: #10b981; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 500; letter-spacing: 0.5px; }
  .tabs { display: flex; gap: 0; padding: 0 32px; border-bottom: 1px solid #1a1a1a; background: #0a0a0a; }
  .tab { padding: 14px 20px; font-size: 11px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: #444; cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; font-family: 'DM Mono', monospace; }
  .tab:hover { color: #888; }
  .tab.active { color: #10b981; border-bottom-color: #10b981; }
  .content { padding: 32px; max-width: 1200px; margin: 0 auto; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; }
  .btn { background: #10b981; color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .btn:hover { background: #0d9e6e; transform: translateY(-1px); }
  .btn-ghost { background: transparent; border: 1px solid #2a2a2a; color: #888; padding: 6px 14px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .btn-ghost:hover { border-color: #444; color: #ccc; }
  .btn-danger { background: transparent; border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 5px 12px; border-radius: 5px; font-size: 10px; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .btn-danger:hover { background: rgba(239,68,68,0.1); }
  .card { background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; transition: border-color 0.2s; }
  .card:hover { border-color: #2a2a2a; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .stat-card { background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; }
  .stat-label { font-size: 10px; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; }
  .stat-sub { font-size: 11px; color: #444; margin-top: 4px; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #444; padding: 10px 16px; border-bottom: 1px solid #1a1a1a; font-weight: 500; }
  .table td { padding: 14px 16px; font-size: 12px; color: #aaa; border-bottom: 1px solid #141414; vertical-align: middle; }
  .table tr:last-child td { border-bottom: none; }
  .table tr:hover td { background: rgba(255,255,255,0.02); }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 500; letter-spacing: 0.3px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 10px; color: #555; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .form-input { width: 100%; background: #0d0d0d; border: 1px solid #222; border-radius: 6px; padding: 10px 12px; color: #e8e8e8; font-size: 13px; font-family: 'DM Mono', monospace; outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: #10b981; }
  .form-select { width: 100%; background: #0d0d0d; border: 1px solid #222; border-radius: 6px; padding: 10px 12px; color: #e8e8e8; font-size: 13px; font-family: 'DM Mono', monospace; outline: none; cursor: pointer; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #111; border: 1px solid #2a2a2a; border-radius: 12px; padding: 28px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 24px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #333; }
  .empty-state-title { font-family: 'Syne', sans-serif; font-size: 16px; color: #444; margin-bottom: 8px; }
  .empty-state-sub { font-size: 12px; color: #333; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 14px 20px; font-size: 12px; color: #e8e8e8; z-index: 300; animation: slideUp 0.3s ease; max-width: 300px; }
  .toast.success { border-color: rgba(16,185,129,0.4); }
  .toast.error { border-color: rgba(239,68,68,0.4); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; color: #333; font-size: 12px; gap: 10px; }
  .spinner { width: 16px; height: 16px; border: 2px solid #222; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .divider { height: 1px; background: #1a1a1a; margin: 24px 0; }
  @media (max-width: 768px) { .content { padding: 16px; } .header { padding: 14px 16px; } .tabs { padding: 0 16px; overflow-x: auto; } .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } .tab { padding: 12px 14px; white-space: nowrap; } }
`;

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{message}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  );
}

function CreatorsTab({ toast }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", tiktok_handle: "", portal_slug: "", brief: "" });

  useEffect(() => { fetchCreators(); }, []);

  async function fetchCreators() {
    setLoading(true);
    const { data, error } = await supabase.from("creators").select("*").order("created_at", { ascending: false });
    if (error) toast("Failed to load creators", "error");
    else setCreators(data || []);
    setLoading(false);
  }

  async function addCreator() {
    if (!form.name || !form.tiktok_handle) return toast("Name and TikTok handle required", "error");
    const slug = form.portal_slug || form.tiktok_handle.replace("@", "").toLowerCase();
    const { error } = await supabase.from("creators").insert([{ ...form, portal_slug: slug }]);
    if (error) toast(error.message, "error");
    else { toast("Creator added", "success"); setShowModal(false); setForm({ name: "", tiktok_handle: "", portal_slug: "", brief: "" }); fetchCreators(); }
  }

  async function deleteCreator(id) {
    const { error } = await supabase.from("creators").delete().eq("id", id);
    if (error) toast(error.message, "error");
    else { toast("Creator removed", "success"); fetchCreators(); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Creators</div>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add Creator</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : creators.length === 0 ? (
          <div className="empty-state"><div className="empty-state-title">No creators yet</div><div className="empty-state-sub">Add your first UGC creator to get started</div></div>
        ) : (
          <table className="table">
            <thead><tr><th>Name</th><th>TikTok</th><th>Portal Slug</th><th>Brief</th><th>Added</th><th></th></tr></thead>
            <tbody>
              {creators.map(c => (
                <tr key={c.id}>
                  <td style={{ color: "#e8e8e8", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ color: "#10b981" }}>{c.tiktok_handle}</td>
                  <td style={{ color: "#888" }}>{c.portal_slug}</td>
                  <td style={{ color: "#666", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.brief || "—"}</td>
                  <td style={{ color: "#444" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td><button className="btn-danger" onClick={() => deleteCreator(c.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <Modal title="Add Creator" onClose={() => setShowModal(false)}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Jane Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">TikTok Handle</label><input className="form-input" placeholder="@username" value={form.tiktok_handle} onChange={e => setForm({ ...form, tiktok_handle: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Portal Slug (optional)</label><input className="form-input" placeholder="auto-generated if blank" value={form.portal_slug} onChange={e => setForm({ ...form, portal_slug: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Brief / Notes</label><input className="form-input" placeholder="Product focus, style notes..." value={form.brief} onChange={e => setForm({ ...form, brief: e.target.value })} /></div>
          <div className="modal-actions"><button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn" onClick={addCreator}>Add Creator</button></div>
        </Modal>
      )}
    </div>
  );
}

function QueueTab({ toast }) {
  const [videos, setVideos] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ creator_id: "", product_name: "", caption: "", status: "pending", file_url: "", scheduled_at: "" });

  useEffect(() => { fetchVideos(); supabase.from("creators").select("id, name").then(({ data }) => setCreators(data || [])); }, []);

  async function fetchVideos() {
    setLoading(true);
    const { data, error } = await supabase.from("videos").select("*, creators(name, tiktok_handle)").order("created_at", { ascending: false });
    if (error) toast("Failed to load queue", "error");
    else setVideos(data || []);
    setLoading(false);
  }

  async function addVideo() {
    if (!form.creator_id || !form.product_name) return toast("Creator and product required", "error");
    const { error } = await supabase.from("videos").insert([form]);
    if (error) toast(error.message, "error");
    else { toast("Video added to queue", "success"); setShowModal(false); setForm({ creator_id: "", product_name: "", caption: "", status: "pending", file_url: "", scheduled_at: "" }); fetchVideos(); }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from("videos").update({ status }).eq("id", id);
    if (error) toast(error.message, "error");
    else { toast(`Status → ${status}`, "success"); fetchVideos(); }
  }

  const filtered = filter === "all" ? videos : videos.filter(v => v.status === filter);

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Video Queue</div>
        <div style={{ display: "flex", gap: 10 }}>
          <select className="form-select" style={{ width: "auto", fontSize: 11 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="posted">Posted</option><option value="rejected">Rejected</option>
          </select>
          <button className="btn" onClick={() => setShowModal(true)}>+ Add Video</button>
        </div>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-title">No videos in queue</div><div className="empty-state-sub">Add a video to start the pipeline</div></div>
        ) : (
          <table className="table">
            <thead><tr><th>Creator</th><th>Product</th><th>Caption</th><th>Status</th><th>Scheduled</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td style={{ color: "#e8e8e8" }}>{v.creators?.name || "—"}</td>
                  <td style={{ color: "#10b981" }}>{v.product_name}</td>
                  <td style={{ color: "#666", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.caption || "—"}</td>
                  <td><span className="badge" style={{ background: `${statusColors[v.status]}18`, color: statusColors[v.status] }}>{v.status}</span></td>
                  <td style={{ color: "#444" }}>{v.scheduled_at ? new Date(v.scheduled_at).toLocaleDateString() : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {v.status === "pending" && <button className="btn-ghost" style={{ fontSize: 10, padding: "4px 10px" }} onClick={() => updateStatus(v.id, "approved")}>Approve</button>}
                      {v.status === "approved" && <button className="btn" style={{ fontSize: 10, padding: "4px 10px" }} onClick={() => updateStatus(v.id, "posted")}>Mark Posted</button>}
                      {v.status !== "rejected" && v.status !== "posted" && <button className="btn-danger" onClick={() => updateStatus(v.id, "rejected")}>Reject</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <Modal title="Add to Queue" onClose={() => setShowModal(false)}>
          <div className="form-group"><label className="form-label">Creator</label><select className="form-select" value={form.creator_id} onChange={e => setForm({ ...form, creator_id: e.target.value })}><option value="">Select creator...</option>{creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" placeholder="e.g. Glow Serum" value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Caption</label><input className="form-input" placeholder="TikTok caption..." value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">File URL</label><input className="form-input" placeholder="https://..." value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Schedule Date</label><input className="form-input" type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} /></div>
          <div className="modal-actions"><button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn" onClick={addVideo}>Add to Queue</button></div>
        </Modal>
      )}
    </div>
  );
}

function ProductsTab({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", affiliate_link: "", commission_rate: "", price: "", status: "active", notes: "" });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) toast("Failed to load products", "error");
    else setProducts(data || []);
    setLoading(false);
  }

  async function addProduct() {
    if (!form.name) return toast("Product name required", "error");
    const { error } = await supabase.from("products").insert([{ ...form, commission_rate: parseFloat(form.commission_rate) || null, price: parseFloat(form.price) || null }]);
    if (error) toast(error.message, "error");
    else { toast("Product added", "success"); setShowModal(false); setForm({ name: "", affiliate_link: "", commission_rate: "", price: "", status: "active", notes: "" }); fetchProducts(); }
  }

  async function deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast(error.message, "error");
    else { toast("Product removed", "success"); fetchProducts(); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Products</div>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : products.length === 0 ? (
          <div className="empty-state"><div className="empty-state-title">No products yet</div><div className="empty-state-sub">Add TikTok Shop affiliate products to promote</div></div>
        ) : (
          <table className="table">
            <thead><tr><th>Product</th><th>Price</th><th>Commission</th><th>Status</th><th>Link</th><th>Notes</th><th></th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ color: "#e8e8e8", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ color: "#10b981" }}>{p.price ? `$${p.price}` : "—"}</td>
                  <td style={{ color: "#f59e0b" }}>{p.commission_rate ? `${p.commission_rate}%` : "—"}</td>
                  <td><span className="badge" style={{ background: `${statusColors[p.status] || "#6b7280"}18`, color: statusColors[p.status] || "#6b7280" }}>{p.status}</span></td>
                  <td>{p.affiliate_link ? <a href={p.affiliate_link} target="_blank" rel="noreferrer" style={{ color: "#3b82f6", fontSize: 11 }}>Link ↗</a> : "—"}</td>
                  <td style={{ color: "#555", fontSize: 11 }}>{p.notes || "—"}</td>
                  <td><button className="btn-danger" onClick={() => deleteProduct(p.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <Modal title="Add Product" onClose={() => setShowModal(false)}>
          <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" placeholder="e.g. Glow Serum 2oz" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
            <div><label className="form-label">Price ($)</label><input className="form-input" type="number" placeholder="29.99" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
            <div><label className="form-label">Commission (%)</label><input className="form-input" type="number" placeholder="15" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Affiliate Link</label><input className="form-input" placeholder="https://..." value={form.affiliate_link} onChange={e => setForm({ ...form, affiliate_link: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div className="form-group"><label className="form-label">Notes</label><input className="form-input" placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="modal-actions"><button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn" onClick={addProduct}>Add Product</button></div>
        </Modal>
      )}
    </div>
  );
}

function AffiliatesTab({ toast }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", platform: "TikTok Shop", affiliate_id: "", commission_rate: "", total_earnings: "", status: "active", notes: "" });

  useEffect(() => { fetchAffiliates(); }, []);

  async function fetchAffiliates() {
    setLoading(true);
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false });
    if (error) toast("Failed to load affiliates", "error");
    else setAffiliates(data || []);
    setLoading(false);
  }

  async function addAffiliate() {
    if (!form.name) return toast("Name required", "error");
    const { error } = await supabase.from("affiliates").insert([{ ...form, commission_rate: parseFloat(form.commission_rate) || null, total_earnings: parseFloat(form.total_earnings) || 0 }]);
    if (error) toast(error.message, "error");
    else { toast("Affiliate added", "success"); setShowModal(false); setForm({ name: "", platform: "TikTok Shop", affiliate_id: "", commission_rate: "", total_earnings: "", status: "active", notes: "" }); fetchAffiliates(); }
  }

  async function deleteAffiliate(id) {
    const { error } = await supabase.from("affiliates").delete().eq("id", id);
    if (error) toast(error.message, "error");
    else { toast("Affiliate removed", "success"); fetchAffiliates(); }
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Affiliates</div>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add Affiliate</button>
      </div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /> Loading...</div> : affiliates.length === 0 ? (
          <div className="empty-state"><div className="empty-state-title">No affiliates yet</div><div className="empty-state-sub">Track your TikTok Shop affiliate programs here</div></div>
        ) : (
          <table className="table">
            <thead><tr><th>Name</th><th>Platform</th><th>Affiliate ID</th><th>Commission</th><th>Earnings</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {affiliates.map(a => (
                <tr key={a.id}>
                  <td style={{ color: "#e8e8e8", fontWeight: 500 }}>{a.name}</td>
                  <td style={{ color: "#888" }}>{a.platform}</td>
                  <td style={{ color: "#555", fontSize: 11 }}>{a.affiliate_id || "—"}</td>
                  <td style={{ color: "#f59e0b" }}>{a.commission_rate ? `${a.commission_rate}%` : "—"}</td>
                  <td style={{ color: "#10b981" }}>{a.total_earnings ? `$${parseFloat(a.total_earnings).toFixed(2)}` : "$0.00"}</td>
                  <td><span className="badge" style={{ background: `${statusColors[a.status] || "#6b7280"}18`, color: statusColors[a.status] || "#6b7280" }}>{a.status}</span></td>
                  <td><button className="btn-danger" onClick={() => deleteAffiliate(a.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <Modal title="Add Affiliate" onClose={() => setShowModal(false)}>
          <div className="form-group"><label className="form-label">Name / Program</label><input className="form-input" placeholder="e.g. TikTok Shop Affiliate" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Platform</label><input className="form-input" placeholder="TikTok Shop, CJ, etc." value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Affiliate ID</label><input className="form-input" placeholder="Your affiliate ID" value={form.affiliate_id} onChange={e => setForm({ ...form, affiliate_id: e.target.value })} /></div>
          <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
            <div><label className="form-label">Commission (%)</label><input className="form-input" type="number" placeholder="15" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} /></div>
            <div><label className="form-label">Total Earnings ($)</label><input className="form-input" type="number" placeholder="0.00" value={form.total_earnings} onChange={e => setForm({ ...form, total_earnings: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><input className="form-input" placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="modal-actions"><button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn" onClick={addAffiliate}>Add Affiliate</button></div>
        </Modal>
      )}
    </div>
  );
}

function AnalyticsTab({ toast }) {
  const [stats, setStats] = useState({ creators: 0, videos: 0, posted: 0, pending: 0, approved: 0, products: 0, affiliates: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    setLoading(true);
    const [c, v, p, a] = await Promise.all([
      supabase.from("creators").select("id", { count: "exact" }),
      supabase.from("videos").select("id, status", { count: "exact" }),
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("affiliates").select("total_earnings"),
    ]);
    const videos = v.data || [];
    const earnings = (a.data || []).reduce((sum, x) => sum + (parseFloat(x.total_earnings) || 0), 0);
    setStats({ creators: c.count || 0, videos: videos.length, posted: videos.filter(x => x.status === "posted").length, pending: videos.filter(x => x.status === "pending").length, approved: videos.filter(x => x.status === "approved").length, products: p.count || 0, earnings });
    setLoading(false);
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading...</div>;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Analytics</div>
        <button className="btn-ghost" onClick={fetchStats}>↻ Refresh</button>
      </div>
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[{ label: "Creators", value: stats.creators, sub: "Active UGC creators" }, { label: "Total Videos", value: stats.videos, sub: "In pipeline" }, { label: "Posted", value: stats.posted, sub: "Live on TikTok" }, { label: "Total Earnings", value: `$${stats.earnings.toFixed(2)}`, sub: "Affiliate revenue" }].map(s => (
          <div className="stat-card" key={s.label}><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-sub">{s.sub}</div></div>
        ))}
      </div>
      <div className="grid-3">
        {[{ label: "Pending Review", value: stats.pending, color: "#f59e0b" }, { label: "Approved", value: stats.approved, color: "#10b981" }, { label: "Products Active", value: stats.products, color: "#3b82f6" }].map(s => (
          <div className="stat-card" key={s.label}><div className="stat-label">{s.label}</div><div className="stat-value" style={{ color: s.color }}>{s.value}</div></div>
        ))}
      </div>
      <div className="divider" />
      <div className="card">
        <div style={{ fontSize: 12, color: "#555", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>Pipeline Health</div>
        {stats.videos > 0 ? (
          <div>
            {[{ label: "Posted", count: stats.posted, color: "#3b82f6" }, { label: "Approved", count: stats.approved, color: "#10b981" }, { label: "Pending", count: stats.pending, color: "#f59e0b" }].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "#666" }}><span>{s.label}</span><span>{s.count} / {stats.videos}</span></div>
                <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${stats.videos ? (s.count / stats.videos) * 100 : 0}%`, background: s.color, borderRadius: 2, transition: "width 0.6s ease" }} /></div>
              </div>
            ))}
          </div>
        ) : <div className="empty-state" style={{ padding: "30px 0" }}><div className="empty-state-sub">No video data yet — add videos to see pipeline stats</div></div>}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Creators");
  const [toastMsg, setToastMsg] = useState(null);

  function showToast(message, type = "success") { setToastMsg({ message, type }); }

  const tabProps = { toast: showToast };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo"><div className="logo-dot" />AUTOSHOP</div>
          <div className="header-right"><span className="status-pill">● LIVE</span><span>UGC Autopilot</span></div>
        </header>
        <nav className="tabs">
          {TABS.map(tab => <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </nav>
        <main className="content">
          {activeTab === "Creators" && <CreatorsTab {...tabProps} />}
          {activeTab === "Queue" && <QueueTab {...tabProps} />}
          {activeTab === "Products" && <ProductsTab {...tabProps} />}
          {activeTab === "Affiliates" && <AffiliatesTab {...tabProps} />}
          {activeTab === "Analytics" && <AnalyticsTab {...tabProps} />}
        </main>
        {toastMsg && <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
      </div>
    </>
  );
}
