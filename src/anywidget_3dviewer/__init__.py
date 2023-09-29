import importlib.metadata
import pathlib
import anywidget
from traitlets import Unicode

try:
    __version__ = importlib.metadata.version("anywidget_3dviewer")
except importlib.metadata.PackageNotFoundError:
    __version__ = "unknown"

class Viewer(anywidget.AnyWidget):

    gltf_data = Unicode("").tag(sync=True)
    _esm = pathlib.Path(__file__).parent / "static" / "viewer.js"
