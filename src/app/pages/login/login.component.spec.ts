import { SpotifyService } from 'src/app/services/spotify.service';
import { ActivatedRouteStub } from './../../__mocks__/activated-route-stub';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { SpotifyServiceStub } from 'src/app/__mocks__/spotify-service-stub';

describe('HomeComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let spotifyServiceStub: SpotifyServiceStub;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async () => {
    spotifyServiceStub = new SpotifyServiceStub();
    activatedRouteStub = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    activatedRouteStub.setParamMap({ code: 'sample_authorization_code' });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should store tokens in localstorage', () => {
  //   expect(localStorage.getItem('access_token')).toBe('test-access-token');
  //   expect(localStorage.getItem('refresh_token')).toBe('test-refresh-token');
  // });
});
