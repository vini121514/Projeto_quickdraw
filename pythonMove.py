import os
import shutil
import time

# Caminho da pasta de downloads e da pasta de destino
downloads_folder = os.path.expanduser('~/Downloads')  # Caminho para a pasta Downloads
print(os.path.exists('~/Documentos/coiso/images'))
destination_folder = os.path.expanduser("C:/Users/23011105/Documents/coiso/images")
# Extensões de imagem que você quer mover
image_extensions = ['.png', '.jpg', '.jpeg', '.gif']

# Verifica se a pasta de destino existe, caso contrário, cria
if not os.path.exists(destination_folder):
    os.makedirs(destination_folder)
    print(f"Pasta de destino criada: {destination_folder}")

def move_images():
    print(f"Checando arquivos na pasta Downloads: {downloads_folder}")
    for filename in os.listdir(downloads_folder):
        file_path = os.path.join(downloads_folder, filename)
        
        if os.path.isfile(file_path):
            if filename.lower().endswith(tuple(image_extensions)):
                destination_path = os.path.join(destination_folder, filename)
                print(f"Mover {file_path} para {destination_path}")
                try:
                    shutil.move(file_path, destination_path)
                    print(f"Imagem movida: {filename}")
                    list_images_in_folder(destination_folder)  # Lista os arquivos na pasta de destino após mover a imagem
                except Exception as e:
                    print(f"Erro ao mover {filename}: {e}")

def list_images_in_folder(folder):
    print(f"\nConteúdo da pasta {folder}:")
    try:
        for filename in os.listdir(folder):
            print(filename)
    except Exception as e:
        print(f"Erro ao listar o conteúdo da pasta: {e}")

if __name__ == "__main__":
    print("Monitorando a pasta Downloads...")
    while True:
        move_images()
        time.sleep(1)  # Aguarda 1 segundo antes de checar novamente
        #list_images_in_folder(destination_folder)
