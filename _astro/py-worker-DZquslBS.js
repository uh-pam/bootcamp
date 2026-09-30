const e=`https://cdn.jsdelivr.net/pyodide/v314.0.7/full/`,t=String.raw`
import sys, io, base64, traceback, warnings, os, ast
os.environ["MPLBACKEND"] = "Agg"
warnings.filterwarnings("ignore", message=".*non-interactive.*")
warnings.filterwarnings("ignore", category=DeprecationWarning)
from pyodide.code import eval_code_async

HINTS = {
    "NameError": "Python does not know this name yet. Check the spelling, and run the cells above this one first.",
    "SyntaxError": "Python could not read this line. Look for a missing bracket, quote, colon or comma.",
    "IndentationError": "The spaces at the start of a line do not line up. Lines inside a def, for or if need the same indent.",
    "TypeError": "An operation got the wrong kind of value, e.g. adding text to a number, or arithmetic on a whole list.",
    "IndexError": "You asked for a position that does not exist. Positions start at 0 and stop one before the length.",
    "KeyError": "There is no column or key with that exact name. Check spelling and capital letters (try df.columns).",
    "ValueError": "The value has the right type but the wrong shape or content, e.g. arrays of different lengths.",
    "ZeroDivisionError": "Something was divided by zero.",
    "AttributeError": "This kind of object has no method or attribute with that name. Check the spelling after the dot.",
    "ModuleNotFoundError": "That package is not available here. In Bootcamp you can use numpy, pandas, matplotlib and scipy.",
    "FileNotFoundError": "There is no file with that name here. Check the file name in quotes.",
}

def _bc_error(e, label):
    tb = traceback.extract_tb(e.__traceback__)
    line = None
    for fr in tb:
        if fr.filename == label:
            line = fr.lineno
    if isinstance(e, SyntaxError) and getattr(e, "filename", None) == label:
        line = e.lineno
    name = type(e).__name__
    msg = str(e) if not isinstance(e, SyntaxError) else (e.msg or "invalid syntax")
    hint = HINTS.get(name, "")
    if name == "NameError" and "'___'" in msg:
        hint = "Replace the blank ___ with your own code, then run again."
    return {"type": name, "message": msg, "line": line, "hint": hint}

def _bc_figures(close=True):
    out = []
    if "matplotlib.pyplot" in sys.modules:
        import matplotlib.pyplot as plt
        for num in plt.get_fignums():
            fig = plt.figure(num)
            buf = io.BytesIO()
            fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
            out.append(base64.b64encode(buf.getvalue()).decode())
        if close:
            plt.close("all")
    return out

def _bc_close():
    if "matplotlib.pyplot" in sys.modules:
        import matplotlib.pyplot as plt
        plt.close("all")

async def _bc_run(src, ns, label, keep=False):
    out, err = io.StringIO(), io.StringIO()
    old = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    res = {"ok": True, "html": None, "repr": None, "error": None}
    try:
        val = await eval_code_async(src, ns, filename=label)
        if val is not None:
            if hasattr(val, "_repr_html_") and type(val).__module__.startswith("pandas"):
                res["html"] = val._repr_html_()
            else:
                res["repr"] = repr(val)
    except BaseException as e:
        res["ok"] = False
        res["error"] = _bc_error(e, label)
    finally:
        sys.stdout, sys.stderr = old
    res["stdout"] = out.getvalue()
    res["stderr"] = err.getvalue()
    res["figs"] = _bc_figures(close=not keep)
    return res

async def _bc_test(src, ns):
    """Run hidden tests: plain asserts with a message. Figures from the cell are still open. Returns (passed, message)."""
    try:
        await eval_code_async(src, ns, filename="<tests>")
        return {"pass": True, "message": ""}
    except AssertionError as e:
        return {"pass": False, "message": str(e) or "Not quite yet — compare your result with the task."}
    except BaseException as e:
        return {"pass": False, "message": f"{type(e).__name__}: {e}"}
    finally:
        _bc_close()
`;let n=null,r=null;const i=/* @__PURE__ */ new Map,a=/* @__PURE__ */ new Set,o=/* @__PURE__ */ new Set,s=e=>self.postMessage(e);async function c(){s({type:`status`,text:`Starting Python (first time only, about 10 seconds)…`});let{loadPyodide:r}=await import(
/* @vite-ignore */
e+`pyodide.mjs`);n=await r({indexURL:e}),await n.runPythonAsync(t)}function l(e){let t=i.get(e);return t||(t=n.globals.get(`dict`)(),i.set(e,t)),t}async function u(e){let t=[`numpy`,`pandas`,`matplotlib`,`scipy`].filter(t=>RegExp(`\\b(import|from)\\s+${t}\\b`).test(e)).filter(e=>!n.loadedPackages[e]);t.length&&(s({type:`status`,text:`Loading ${t.join(`, `)}…`}),await n.loadPackage(t))}async function d(e,t){for(let r of e){if(o.has(r))continue;let e=await fetch(`${t}data/${r}`);if(!e.ok)throw Error(`Could not load data file ${r}`);let i=new Uint8Array(await e.arrayBuffer());n.FS.writeFile(r.split(`/`).pop(),i),o.add(r)}}const f=e=>{let t=e.toJs({dict_converter:Object.fromEntries});return e.destroy?.(),t};self.onmessage=async e=>{let t=e.data;try{if(r??=c(),await r,t.type===`reset`){i.delete(t.page),[...a].filter(e=>e.startsWith(t.page+`::`)).forEach(e=>a.delete(e)),s({id:t.id,type:`done`,result:{ok:!0,stdout:``,stderr:``,figs:[]}});return}let e=l(t.page);await u([t.setup,t.code,t.tests].filter(Boolean).join(`
`)),t.files?.length&&await d(t.files,t.base),s({type:`status`,text:`Running…`});let o=n.globals.get(`_bc_run`),p=`${t.page}::${t.cell}`;if(t.setup&&!a.has(p)){let n=f(await o(t.setup,e,`<setup>`));if(!n.ok){s({id:t.id,type:`done`,result:{...n,setupFailed:!0}});return}a.add(p)}let m=f(await o(t.code,e,`<cell>`,!!t.tests));m.ok&&t.tests&&(m.test=f(await n.globals.get(`_bc_test`)(t.tests,e))),s({id:t.id,type:`done`,result:m})}catch(e){s({id:t.id,type:`done`,result:{ok:!1,error:{type:`Startup`,message:String(e?.message??e),hint:`Python could not start. Check your internet connection and reload the page.`},stdout:``,stderr:``,figs:[]}})}};