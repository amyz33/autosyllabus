#need to make sure that python-docx is installed before you can use it
from docx import Document

document = Document()
document.save('test.docx')