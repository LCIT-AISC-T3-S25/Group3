import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, z_dim=100, img_channels=3, feature_g=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(z_dim, feature_g*8*4*4),
            nn.ReLU(True),
            nn.Unflatten(1, (feature_g*8, 4, 4)),
            nn.ConvTranspose2d(feature_g*8, feature_g*4, 4, 2, 1), nn.ReLU(True),
            nn.ConvTranspose2d(feature_g*4, feature_g*2, 4, 2, 1), nn.ReLU(True),
            nn.ConvTranspose2d(feature_g*2, feature_g, 4, 2, 1), nn.ReLU(True),
            nn.ConvTranspose2d(feature_g, img_channels, 4, 2, 1), nn.Tanh(),
        )

    def forward(self, z):
        return self.net(z)
